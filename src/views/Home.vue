<template>
  <div class="home">
    <div class="menu-left p-4">
      <div class="d-flex flex-column justify-content-between fill">
        <div class="">
          <h1>Bokksu</h1>
          <hr class="pb-4" />

          <form>
            <div class="form-group">
              <label for="exampleFormControlSelect1"
                >Seleccioná tu comisión</label
              >
              <select class="form-control" id="exampleFormControlSelect1">
                <option>1 | Carla y Meli</option>
                <option>2 | Lu y Kari</option>
                <option>3 | Axel y Juanma</option>
                <option>4 | Sil, Jud y Mili</option>
              </select>
            </div>

            <div class="form-group">
              <label for="exampleFormControlSelect1">Tema</label>
              <select class="form-control" id="exampleFormControlSelect1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>

            <div class="form-group">
              <label for="exampleFormControlInput1">Datos</label>
              <input
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="Nombre"
              />
              <input
                type="email"
                class="form-control mt-2"
                id="exampleFormControlInput1"
                placeholder="Apellido"
              />
            </div>
          </form>

          <a href="#">Descargar plantilla (JPG)</a>

          <div class="form-group">
            <label for="exampleFormControlFile1">Subir imagen</label>
            <div class="file-upload-edited">
              <input type="file" class="file-upload" @change="updateTexture" />
              <button class="file-upload-btn">Seleccionar archivo</button>
            </div>
          </div>

          <img src="" id="uploadedImg" style="width: 300px;" />

          <button type="submit" class="btn btn-primary btn-block">
            Guardar
          </button>
        </div>

        <div>
          <table class="table table-borderless text-center mt-5">
            <thead>
              <tr>
                <th class="tabla-instrucciones" scope="col">
                  Con click izquierdo
                </th>
                <th class="tabla-instrucciones" scope="col">Con la ruedita</th>
                <th class="tabla-instrucciones" scope="col">
                  Con click derecho
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src="/img/iconos-rotacion-03.svg"
                    class=""
                    alt="Rotación con click izquierdo"
                  />
                </td>
                <td>
                  <img
                    src="/img/iconos-zoom-02.svg"
                    class=""
                    alt="Zoom con la ruedita"
                  />
                </td>
                <td>
                  <img
                    src="/img/iconos-camara-04.svg"
                    class=""
                    alt="Cámara con click derecho"
                  />
                </td>
              </tr>

              <tr>
                <td class="tabla-subtitulo">Rotación</td>
                <td class="tabla-subtitulo">Zoom</td>
                <td class="tabla-subtitulo">Cámara</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="info">
      Melina Ávila Alterach
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default {
  name: "home",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      materials: [],
      mainMaterial: null,
    };
  },
  methods: {
    init: function() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("rgb(80%, 80%, 80%)");

      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      );

      var geometry = new THREE.BoxGeometry(1, 2, 1);

      var names = ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"];
      var textures = [];

      for (let i = 0; i < names.length; i++) {
        var texture = new THREE.TextureLoader().load("img/" + names[i]);
        texture.anisotropy = 16;
        var material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        this.materials.push(material);
        textures.push(texture);
      }

      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // map: new THREE.TextureLoader().load("img/px.jpg"),
      });
      var cube = new THREE.Mesh(geometry, this.materials);

      var light = new THREE.AmbientLight(0xffffff);
      this.scene.add(light);
      // this.scene.add(cube);

      var loader = new FBXLoader();
      loader.load("img/envase_prueba_fondo.fbx", (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            console.log(child);
            child.geometry.attributes.uv2 = child.geometry.attributes.uv;

            // geometry.addAttribute( 'uv2', new THREE.BufferAttribute( geometry.attributes.uv.array, 2 ) );

            // child.material.map = child.material.emissiveMap;
            // child.material.color = new THREE.Color("rgb(100%, 50%, 50%)");
            // child.material.emissiveMap = null;
            // child.material.map.anisotropy = 16;
            // console.log(child);
            // child.material.color = new THREE.Color("rgb(100%, 100%, 100%)");
            // const oldMat = child.material;
            child.material.emissiveMap.anisotropy = 16;

            child.material = new THREE.MeshPhongMaterial({
              color: new THREE.Color("rgb(100%, 100%, 100%)"),
              aoMap: child.material.emissiveMap,
              // ,
            });
            if (child.name === "Cube_1") {
              this.mainMaterial = child.material;
            }
          }
        });

        object.scale.multiplyScalar(0.1);
        this.scene.add(object);
      });

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;

      this.camera.position.set(2, 2, 2);
      this.controls.update();
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    updateTexture: function(evt) {
      const tgt = evt.target || window.event.srcElement,
        files = tgt.files;

      const userImage = evt.target.files[0];
      const userImageURL = URL.createObjectURL(userImage);

      const map = new THREE.TextureLoader()
        .setCrossOrigin("")
        .load(userImageURL);
      map.anisotropy = 16;

      this.mainMaterial.map = map;
      this.mainMaterial.needsUpdate = true;
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style>
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
</style>

<style scoped>
.menu-left {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background-color: white;
  overflow: hidden;
}

.tabla-instrucciones {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
}

.tabla-subtitulo {
  color: grey;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.6rem;
  font-weight: 500;
  line-height: 1.2;
}

table img {
  width: 32px;
  height: 32px;
}

.table td,
.table th {
  padding: 0.42rem !important;
}

h1 {
  font-size: 1.2rem !important;
}

.fill {
  min-height: 100%;
  height: 100%;
}

.info {
  position: absolute;
  bottom: 10px;
  left: 330px;
}

.file-upload-edited {
  position: relative;
  overflow: hidden;
  cursor: pointer !important;
}

.file-upload-edited input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer !important;
}

.file-upload-btn {
  font-size: 0.85rem;
  font-weight: 400;
  background-color: #e7e7e76e;
  border: 1px solid #50505062;
  padding: 0.2rem 0.1rem;
  width: 170px;
  border-radius: 999px;
  letter-spacing: 0.7px;
}
</style>
