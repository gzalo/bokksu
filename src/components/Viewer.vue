<template>
  <div>
    <div class="info">
      {{ data.firstName }} {{ data.lastName }} <br />
      Comisión: {{ commissions.find((commission) => commission.id == data.commission).name }} <br />
      {{ data.date | dateFilter }}
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

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
      controller1: null,
      controller2: null,
      controllerGrip1: null,
      controllerGrip2: null,
      raycaster: null,
    };
  },
  methods: {
    init() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      document.body.appendChild(VRButton.createButton(this.renderer));
      this.renderer.xr.enabled = true;

      this.scene = new THREE.Scene();
      this.scene.background = backgroundColor;

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

      const light = new THREE.AmbientLight(0xffffff);
      this.scene.add(light);

      const loader = new FBXLoader();
      const template = templates.find((temp) => temp.id.toString() === this.data.theme);
      loader.load(`/img/fbx/${template.model}`, (object) => {
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
              const url = `/upload/${this.data.fileName}`;

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
        this.scene.add(object);
      });

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target = new THREE.Vector3(0, 1, 0);
      this.controls.enableDamping = true;

      this.camera.position.set(1.1, 1.8, 2);
      this.controls.update();

      this.controller1 = this.renderer.xr.getController(0);
      this.controller1.addEventListener('selectstart', this.onSelectStart);
      this.controller1.addEventListener('selectend', this.onSelectEnd);
      this.scene.add(this.controller1);

      this.controller2 = this.renderer.xr.getController(1);
      this.controller2.addEventListener('selectstart', this.onSelectStart);
      this.controller2.addEventListener('selectend', this.onSelectEnd);
      this.scene.add(this.controller2);

      const controllerModelFactory = new XRControllerModelFactory();

      this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
      this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
      this.scene.add(this.controllerGrip1);

      this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
      this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));
      this.scene.add(this.controllerGrip2);

      this.raycaster = new THREE.Raycaster();

      this.renderer.setAnimationLoop(() => {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      });
    },
  },
  mounted() {
    this.init();
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
  bottom: 20px;
  left: 20px;
  font-size: 0.9rem;
  color: #606186;
}
</style>
