<template>
  <div>
    <div class="info">
      {{ data.firstName }} {{ data.lastName }} <br />
      Comisión {{ data.commission }} / Tema {{ data.theme }} <br />
      {{ data.date | dateFilter }}
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

/* eslint-disable no-param-reassign */

export default {
  name: 'Viewer',
  props: ['data'],

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
    init() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('rgb(96%, 96%, 96%)');

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

      const light = new THREE.AmbientLight(0xffffff);
      this.scene.add(light);

      const loader = new FBXLoader();
      loader.load('/img/envase_prueba_fondo.fbx', (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.geometry.attributes.uv2 = child.geometry.attributes.uv;
            child.material.emissiveMap.anisotropy = 16;

            child.material = new THREE.MeshPhongMaterial({
              color: new THREE.Color('rgb(100%, 100%, 100%)'),
              aoMap: child.material.emissiveMap,
            });
            if (child.name === 'Cube_1') {
              this.mainMaterial = child.material;
              const url = `/upload/${this.data.fileName}`;

              const map = new THREE.TextureLoader().setCrossOrigin('').load(url);
              map.anisotropy = 16;

              this.mainMaterial.map = map;
              this.mainMaterial.needsUpdate = true;
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
    animate() {
      if (!this.renderer) {
        return;
      }

      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
  destroyed() {
    this.renderer.forceContextLoss();
    this.renderer = null;
  },
};
</script>

<style scoped>
.info {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>
