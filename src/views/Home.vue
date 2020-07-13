<template>
  <div class="home">
    <div class="menu-left">
      <div class="menu-left-inner p-4">
        <div class="d-flex flex-column justify-content-between fill">
          <div>
            <a href="/"><img class="logo-catedra mb-4" src="/img/Logo-Belluccia-150x150.png" alt=""/></a>

            <!-- <h1>Bokksu</h1> -->
            <!-- <hr class="pb-4" /> -->

            <form class="mt-5" v-if="!linkId">
              <h4 class="estilo-label">Descargá la plantilla de tu tema</h4>

              <div class="form-group">
                <select class="form-control" id="exampleFormControlSelect1" v-model="form.theme" @change="changeObject">
                  <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
                </select>
              </div>

              <div class="">
                <a :href="'/img/templates/' + templates.find((template) => template.id == form.theme).download" target="_blank"> <img src="/img/iconos-download.png" class="pr-2" alt="Ícono de descargar" />Descargar</a>
              </div>

              <h4 class="estilo-label">Seleccioná comisión y completá tus datos</h4>
              <div class="form-group mb-3">
                <!-- <label for="exampleFormControlSelect1">Seleccioná tu comisión</label> -->
                <select class="form-control" id="exampleFormControlSelect1" v-model="form.commission">
                  <option v-for="commission in commissions" :key="commission.id" :value="commission.id">{{ commission.id }} | {{ commission.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <!-- <label for="exampleFormControlInput1">Completá tus datos</label> -->
                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Nombre" v-model="form.firstName" />
                <input type="email" class="form-control mt-2" id="exampleFormControlInput1" placeholder="Apellido" v-model="form.lastName" />
              </div>

              <h4 class="estilo-label">Subí tu entrega</h4>
              <div class="form-group form-entrega">
                <!-- <h5>Subí tu entrega</h5> -->
                <h6>Resolución: <strong>4096 x 4096px</strong> <br /><strong>JPG</strong> de alta calidad<br />Peso menor a <strong>8MB</strong></h6>
                <!-- <label for="exampleFormControlFile1">Subí tu entrega</label> -->
                <div class="file-upload-edited pb-2">
                  <input type="file" class="file-upload" @change="updateTexture" ref="file" />
                  <button class="file-upload-btn cursor-pointer">Seleccionar archivo</button>
                  <br /><span class="file-name">{{ fileName }}</span>
                </div>
              </div>

              <span class="alert alert-danger small" v-if="submitErrors">{{ submitErrors }}</span>

              <button type="submit" class="btn btn-primary btn-block" @click="submit" :disabled="submitDisabled || form.firstName.trim() == '' || form.lastName.trim() == '' || submitErrors != ''">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="uploading"></span>
                Guardar
              </button>
            </form>
            <!-- <button @click="view1()">Vista 1</button> -->

            <div v-if="linkId">
              <img src="/img/iconos-correctamente.png" class="img-correcta mt-4 mb-3" alt="Tu imagen se subió correctamente" />
              <br />
              Tu entrega se subió correctamente<br />
              <router-link :to="{ name: 'view', params: { id: linkId } }">Podrás verla en este link</router-link>
            </div>
          </div>

          <div>
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
                  <td class="tabla-subtitulo">Rotación</td>
                  <td class="tabla-subtitulo">Zoom</td>
                  <td class="tabla-subtitulo">Cámara</td>
                </tr>

                <tr>
                  <th class="tabla-instrucciones" scope="col">
                    Click izquierdo
                  </th>
                  <th class="tabla-instrucciones" scope="col">Ruedita</th>
                  <th class="tabla-instrucciones" scope="col">
                    Click derecho
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="info">
      {{ form.firstName }} {{ form.lastName }} <br />
      Comisión: {{ commissions.find((commission) => commission.id == form.commission).name }} <br />
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
const noFilesSelected = 'Ningún archivo seleccionado';
const maxFileSize = 15 * 1024 * 1024;

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
      fileName: noFilesSelected,
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

      this.scene = this.loadScene();

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.target = new THREE.Vector3(0, 1, 0);
      this.camera.position.set(1.773, 1.2, 1.99);

      this.controls.update();
    },
    // view1() {
    // this.camera.position.set(1.679273021934309, 0.9682618917220973, 2.330526311027965);
    // this.camera.rotation.set(-0.1383621152798783, 0.7537824473994289, 0.09501719700633605);
    // },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    updateTexture(evt) {
      const userImage = evt.target.files[0];
      this.file = userImage;

      console.log(this.file);
      if (this.file.size > maxFileSize) {
        this.submitErrors = 'Tu archivo debe pesar menos de 15 MB.';
      } else {
        this.submitErrors = '';
      }

      if (userImage) {
        this.fileName = userImage.name;
        this.submitDisabled = false;
      } else {
        this.fileName = noFilesSelected;
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

      // const light2 = new THREE.DirectionalLight(0xffffff, 0.25);
      // light2.position.set(0, 1, 1.5);
      // this.scene.add(light2);

      // const light3 = new THREE.DirectionalLight(0xffffff, 0.25);
      // light3.position.set(0, 1, -1.5);
      // this.scene.add(light3);

      const loader = new FBXLoader();
      const template = templates.find((temp) => temp.id === this.form.theme);
      loader.load(`img/fbx/${template.model}`, (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.geometry.attributes.uv2 = child.geometry.attributes.uv;
            // child.material.emissiveMap.anisotropy = 16;
            child.material.map.anisotropy = 16;

            console.log(child.name);
            // child.material.color = new THREE.Color('rgb(100%, 100%, 100%)');
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
            }

            if (child.name === template.planeName) {
              child.material = new THREE.MeshPhongMaterial({
                color: backgroundColor,
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });
            }
          }
        });

        object.scale.multiplyScalar(0.1);
        scene.add(object);
      });
      return scene;
    },
    changeObject() {
      this.scene = this.loadScene();
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
  destroyed() {
    // this.renderer.forceContextLoss();
    // this.renderer = null;
  },
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
  width: 30px;
  height: 30px;
}
</style>

<style scoped>
a {
  color: #43438d;
  font-weight: 500;
  /* color: #009688; */
  /* text-decoration: underline; */
}

.menu-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  /* background-color: white; */
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
  color: rgb(170, 170, 170);
}

.tabla-subtitulo {
  color: rgb(112, 112, 112);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
}

table img {
  width: 28px;
  height: 28px;
  opacity: 0.4;
  margin-bottom: 0.5rem;
}

.img-correcta {
  width: 48px;
  height: 48px;
}

.table td,
.table th {
  padding: 0.15rem 0.2rem !important;
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
  letter-spacing: 0.3px;
}

h6 {
  font-size: 0.85rem;
  font-weight: 400;
  color: #7e7e7e;
  margin-bottom: 1.2rem;
  letter-spacing: 0.3px;
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
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer !important;
  background: rgb(56, 56, 120);
  background: linear-gradient(160deg, rgba(56, 56, 120, 0.185) 0%, rgba(23, 23, 128, 0.212) 100%);

  color: #43438d;
  border: 2px solid rgba(56, 56, 120, 0.082);

  /* background-color: rgba(94, 218, 189, 0.336);
  color: rgb(19, 126, 101);
  border: 1px solid rgba(19, 126, 101, 0.192); */
  padding: 0.35rem;
  width: 100%;
  border-radius: 5px;
  letter-spacing: 0.5px;
}

.file-name {
  color: grey;
  font-size: 80%;
  letter-spacing: 0.8px;
  margin-top: 1rem;
}

.btn-primary {
  font-weight: 500;
  letter-spacing: 0.4px;
  background: rgb(61, 61, 102);
  background: linear-gradient(160deg, rgba(61, 61, 102, 1) 0%, rgba(47, 47, 83, 1) 100%);
  /* background: rgb(94, 218, 189);
  background: linear-gradient(166deg, rgb(70, 190, 162) 0%, rgb(43, 143, 118) 100%); */
  border-color: transparent;
  margin-top: 1.5rem;
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
  letter-spacing: 0.8px;
  color: #606186;
}

.estilo-label {
  text-transform: uppercase;
  font-size: 70%;
  font-weight: 400;
  letter-spacing: 0.6px;
  color: #606186;
  margin-top: 40px;
  margin-bottom: 10px;
}

.form-control {
  font-weight: 500;
  color: rgb(59, 59, 66);
}

.form-entrega {
  border: 2px dashed #dfdfdf;
  padding: 1.3rem;
}
</style>
