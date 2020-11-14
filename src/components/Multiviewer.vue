<template>
  <div>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import templates from '../templates';
import commissions from '../commissions';

const backgroundColor = new THREE.Color('rgb(93%, 93%, 93%)');

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
      commissions,
      templates,
      error: '',
    };
  },
  methods: {
    init() {
      const themes = this.data.map((data) => data.theme);
      const uniqueThemes = themes.filter((x, i, a) => a.indexOf(x) === i);
      if (uniqueThemes.length !== 1 || themes.length === 0) {
        this.error = 'Solo se pueden ver entregas del mismo tema';
        return;
      }

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.scene.background = backgroundColor;

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 1000);

      const light = new THREE.AmbientLight(0xffffff);
      this.scene.add(light);

      const loader = new FBXLoader();
      const template = templates.find((temp) => temp.id.toString() === this.data[0].theme);

      loader.load(`/img/fbx/${template.model}`, (object) => {
        let toRemove = null;
        object.traverse((child) => {
          if (child.isMesh) {
            child.geometry.attributes.uv2 = child.geometry.attributes.uv;
            child.material.map.anisotropy = 16;

            if (child.name === template.objectName) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgb(100%, 100%, 100%)'),
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });

              this.mainMaterial = child.material;

              this.mainMaterial.needsUpdate = true;
            } else if (child.name === template.planeName) {
              toRemove = child;
            } else {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgb(100%, 100%, 100%)'),
                aoMap: child.material.map,
                aoMapIntensity: 0.5,
              });
            }
          }
        });

        object.remove(toRemove);

        for (let i = 0; i < this.data.length; i += 1) {
          const myObj = object.clone();
          myObj.scale.multiplyScalar(0.1);
          myObj.position.set((i - this.data.length / 2) * template.separation, 0, 0.2);

          myObj.traverse((child) => {
            if (child.isMesh) {
              if (child.name === template.objectName) {
                child.material = new THREE.MeshPhongMaterial({
                  color: new THREE.Color('rgb(100%, 100%, 100%)'),
                  aoMap: child.material.map,
                  aoMapIntensity: 0.5,
                });

                this.mainMaterial = child.material;
                const url = `/upload/${this.data[i].fileName}`;

                const map = new THREE.TextureLoader().setCrossOrigin('').load(url);
                map.anisotropy = 16;

                this.mainMaterial.map = map;
                this.mainMaterial.needsUpdate = true;
              }
            }
          });

          this.scene.add(myObj);
        }
      });

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target = new THREE.Vector3(0, 1, 0);
      this.controls.enableDamping = true;

      this.camera.position.set(0, 1.8, 5);
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
.error {
  color: white;
}
</style>
