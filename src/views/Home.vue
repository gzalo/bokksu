<template>
  <div class="home">
    <div class="menu-left">
      <div class="menu-left-inner p-4">
        <div class="d-flex flex-column justify-content-between fill">
          <div>
            <div class="d-flex justify-content-between">
              <a href="/"><img class="logo-catedra" src="/img/logo.svg" alt=""/></a>
              <span>
                <a href="#" @click.prevent="changeEn" :class="{ langActive: $i18n.locale == 'en' }">EN</a> |
                <a href="#" @click.prevent="changeEs" :class="{ langActive: $i18n.locale == 'es' }">ES</a>
              </span>
            </div>
            <form class="mt-5" v-if="!linkId">
              <h4 class="estilo-label">{{ $t('downloadTemplate') }}</h4>

              <div class="form-group">
                <select class="form-control" id="exampleFormControlSelect1" v-model="form.theme" @change="changeObject">
                  <option v-for="template in templates" :key="template.id" :value="template.id">{{ $i18n.locale == 'en' ? template.nameEn : template.name }}</option>
                </select>
              </div>

              <div class="">
                <a :href="'/img/templates/' + templates.find((template) => template.id == form.theme).download" target="_blank"> <img src="/img/iconos-download@3x.png" class="mr-2" style="height:16px; width:16px;" alt="Descargar" />{{ $t('download') }}</a>
              </div>

              <h4 class="estilo-label">{{ $t('selectCommission') }}</h4>
              <div class="form-group mb-3">
                <select class="form-control" id="exampleFormControlSelect1" v-model="form.commission">
                  <option v-for="commission in commissions" :key="commission.id" :value="commission.id">{{ commission.id }} | {{ commission.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <input type="email" class="form-control" id="exampleFormControlInput1" :placeholder="$t('firstName')" v-model="form.firstName" />
                <input type="email" class="form-control mt-2" id="exampleFormControlInput1" :placeholder="$t('lastName')" v-model="form.lastName" />
              </div>

              <h4 class="estilo-label">{{ $t('uploadYourSubmission') }}</h4>
              <div class="form-group form-entrega">
                <h6>{{ $t('resolution') }}: <strong>4096 x 4096px</strong>. <br /><strong>JPG</strong> {{ $t('highQuality') }}. <br />{{ $t('weightLessThan') }} <strong>5MB</strong>.</h6>
                <div class="file-upload-edited">
                  <input type="file" class="file-upload" @change="updateTexture" ref="file" />
                  <button class="file-upload-btn cursor-pointer">{{ $t('selectFile') }}</button>
                  <br /><span class="file-name">{{ fileName }}</span>
                </div>
              </div>

              <span class="alert alert-danger small" v-if="submitErrors">{{ submitErrors }}</span>

              <button type="submit" class="btn btn-primary btn-block" @click="submit" :disabled="submitDisabled || form.firstName.trim() == '' || form.lastName.trim() == '' || submitErrors != ''">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="uploading"></span>
                {{ $t('upload') }}
              </button>
            </form>

            <div v-if="linkId">
              <img src="/img/iconos-correctamente.png" class="img-correcta mt-4 mb-3" alt="Image" />
              <br />
              {{ $t('correctlyUploaded') }}<br />
              <router-link :to="{ name: 'view', params: { id: linkId } }">{{ $t('viewLink') }}</router-link>
            </div>

            <div>
              <span class="oldviewer"
                ><a href="/admin">{{ $t('viewer') }}</a></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info">
      {{ form.firstName }} {{ form.lastName }} <br />
      {{ $t('commission') }}: {{ commissions.find((commission) => commission.id == form.commission).name }} <br />
    </div>

    <div class="help">
      <table class="table table-borderless text-center mt-5">
        <tbody>
          <tr>
            <td>
              <img src="/img/iconos-rotacion-03.png" class="" alt="Rotación con click izquierdo" />
            </td>
            <td>
              <img src="/img/iconos-zoom-02.png" class="" alt="Zoom con la ruedita" />
            </td>
            <td>
              <img src="/img/iconos-camara-04.png" class="" alt="Cámara con click derecho" />
            </td>
          </tr>

          <tr>
            <td class="tabla-subtitulo">{{ $t('rotation') }}</td>
            <td class="tabla-subtitulo">{{ $t('zoom') }}</td>
            <td class="tabla-subtitulo">{{ $t('camera') }}</td>
          </tr>

          <tr>
            <th class="tabla-instrucciones" scope="col">
              {{ $t('leftClick') }}
            </th>
            <th class="tabla-instrucciones" scope="col">{{ $t('mouseWheel') }}</th>
            <th class="tabla-instrucciones" scope="col">
              {{ $t('rightWheel') }}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import api from '../api';
import templates from '../templates';
import commissions from '../commissions';

const backgroundColor = new THREE.Color('rgb(93%, 93%, 93%)');
const maxFileSize = 8 * 1024 * 1024;

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

export default {
  name: 'home',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      materials: [],
      mainMaterial: null,
      file: null,
      fileName: this.$i18n.t('noFileSelected'),
      submitDisabled: true,
      linkId: '',
      submitErrors: '',
      templates,
      commissions,
      uploading: false,

      form: {
        commission: 1,
        theme: 1,
        firstName: '',
        lastName: '',
      },
    };
  },
  methods: {
    init() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 1000);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;

      this.scene = this.loadScene();
      this.controls.update();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    updateTexture(evt) {
      const userImage = evt.target.files[0];
      this.file = userImage;

      if (this.file.size > maxFileSize) {
        this.submitErrors = this.$i18n.t('weightLessThanError');
      } else {
        this.submitErrors = '';
      }

      if (userImage) {
        this.fileName = userImage.name;
        this.submitDisabled = false;
      } else {
        this.fileName = this.$i18n.t('noFileSelected');
        this.submitDisabled = true;
        return;
      }

      const userImageURL = URL.createObjectURL(userImage);

      const map = new THREE.TextureLoader().setCrossOrigin('').load(userImageURL);
      map.anisotropy = 16;

      this.mainMaterial.map = map;
      this.mainMaterial.needsUpdate = true;
    },
    submit() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(this.form));
      this.submitDisabled = true;
      this.uploading = true;
      api
        .storeFile(formData)
        .then((data) => {
          this.linkId = data.data._id;
          this.uploading = false;
        })
        .catch((error) => {
          this.submitErrors = error.response.data.error;
          this.submitDisabled = false;
          this.uploading = false;
        });
    },
    loadScene() {
      const scene = new THREE.Scene();
      scene.background = backgroundColor;

      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      const loader = new FBXLoader();
      const template = templates.find((temp) => temp.id === this.form.theme);
      loader.load(`img/fbx/${template.model}`, (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.geometry.attributes.uv2 = child.geometry.attributes.uv;
            if (child.material.map) {
              child.material.map.anisotropy = 16;
            }

            console.log(child.name);

            if (child.name === template.objectName) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgb(100%, 100%, 100%)'),
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });

              this.mainMaterial = child.material;
              const url = `/img/templates/${template.template}`;

              const map = new THREE.TextureLoader().setCrossOrigin('').load(url);
              map.anisotropy = 16;

              this.mainMaterial.map = map;
              this.mainMaterial.needsUpdate = true;
            } else if (child.name === template.planeName) {
              child.material = new THREE.MeshPhongMaterial({
                color: backgroundColor,
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });
            } else {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgb(100%, 100%, 100%)'),
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });
            }
          }
        });

        object.scale.multiplyScalar(0.1);
        scene.add(object);
      });

      const { cameraData } = template;
      this.controls.target = new THREE.Vector3(cameraData[0], cameraData[1], cameraData[2]);
      this.camera.position.set(cameraData[3], cameraData[4], cameraData[5]);
      this.controls.update();

      return scene;
    },
    changeObject() {
      this.scene = this.loadScene();
    },
    changeEn() {
      localStorage.setItem('lang', 'en');
      this.$i18n.locale = 'en';
    },
    changeEs() {
      localStorage.setItem('lang', 'es');
      this.$i18n.locale = 'es';
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
  destroyed() {},
};
</script>

<style>
button {
  cursor: pointer !important;
}

.cursor-pointer {
  cursor: pointer;
}

strong {
  font-weight: 500;
  color: #5a5a5a;
}

body,
html {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.4px;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
canvas:focus {
  outline: none;
}

.logo-catedra {
  width: 28px;
  height: 28px;
}
</style>

<style scoped>
a {
  color: #43438d;
  font-weight: 500;
  font-size: 0.95rem;
}

.menu-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background: linear-gradient(86deg, rgba(254, 253, 253, 1) 30%, rgb(250, 250, 250) 100%);
  overflow: hidden;
}

.menu-left-inner {
  overflow: auto;
  height: 100%;
}

.tabla-instrucciones {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.3;
  color: rgb(102, 102, 102);
}

.tabla-subtitulo {
  color: rgb(80, 80, 80);
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
}

table img {
  width: 28px;
  height: 28px;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.img-correcta {
  width: 48px;
  height: 48px;
}

.table td,
.table th {
  padding: 0.2rem 0.5rem !important;
}

h1 {
  font-size: 1.2rem !important;
}

h5 {
  font-size: 1.05rem;
  font-weight: 400;
  color: #696969;
  margin-bottom: 0.3rem;
  margin-top: 0.4rem;
}

h6 {
  font-size: 0.8rem;
  font-weight: 400;
  color: #7e7e7e;
  margin-bottom: 1.2rem;
  line-height: 1.4;
}

.fill {
  min-height: 100%;
  height: 100%;
}

.info {
  position: absolute;
  bottom: 20px;
  left: 360px;
  font-size: 0.9rem;
  color: #606186;
}

.help {
  position: absolute;
  bottom: 4px;
  right: 40px;
  font-size: 0.9rem;
  color: #606186;
}

.file-upload-edited {
  position: relative;
  overflow: hidden;
  cursor: pointer !important;
}

.file-upload-edited input[type='file'] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer !important;
}

.file-upload-btn {
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer !important;
  background: rgb(56, 56, 120);
  background: linear-gradient(160deg, rgba(56, 56, 120, 0.185) 0%, rgba(23, 23, 128, 0.212) 100%);

  color: #43438d;
  border: 2px solid rgba(56, 56, 120, 0.082);

  padding: 0.35rem;
  width: 100%;
  border-radius: 5px;
}

.file-name {
  color: grey;
  font-size: 80%;
  margin-top: 1rem;
}

.btn-primary {
  font-weight: 500;
  background: rgb(61, 61, 102);
  background: linear-gradient(160deg, rgba(61, 61, 102, 1) 0%, rgba(47, 47, 83, 1) 100%);
  border-color: transparent;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.btn-primary.disabled,
.btn-primary:disabled {
  background: linear-gradient(153deg, rgba(200, 200, 200, 1) 0%, rgba(172, 172, 172, 1) 100%);
  border-color: rgba(151, 151, 151, 0.452);
  color: #5a5a5a;
}

label {
  text-transform: uppercase;
  font-size: 70%;
  font-weight: 400;
  color: #606186;
}

.estilo-label {
  text-transform: uppercase;
  font-size: 66%;
  font-weight: 400;
  letter-spacing: 0.8px;
  color: #606186;
  margin-top: 36px;
  margin-bottom: 10px;
}

.form-control {
  font-weight: 500;
  color: rgb(59, 59, 66);
  font-size: 0.95rem;
}

.form-entrega {
  border: 2px dashed #dfdfdf;
  padding: 1.1rem;
}

.oldviewer a {
  font-size: 0.75rem;
  font-weight: light;
  color: rgb(150, 150, 150);
}

.langActive {
  font-weight: bold;
}
</style>
