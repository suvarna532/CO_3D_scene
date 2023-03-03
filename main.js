import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class Animation {
  static interpolate(_object, start, end, step, property) {
    if (start.x < end.x) {
      if (_object[property].x < end.x) {
        _object[property].x += step;
      }
    } else if (start.x > end.x) {
      if (_object[property].x > end.x) {
        _object[property].x -= step;
      }
    }
    
    if (start.y < end.y) {
      if (_object[property].y < end.y) {
        _object[property].y += step;
      }
    } else if (start.y > end.y) {
      if (_object[property].y > end.y) {
        _object[property].y -= step;
      }
    }
    
    if (start.z < end.z) {
      if (_object[property].z < end.z) {
        _object[property].z += step;
      }
    } else if (start.z > end.z) {
      if (_object[property].z > end.z) {
        _object[property].z -= step;
      }
    }
}

class BasicWorldDemo {
  constructor() {
    this.boxes = [];
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth - 10, window.innerHeight - 10);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    this.clock = new THREE.Clock();

    const fov = 60;
    const aspect = 1900 / 1080;
    const near = 1.0;
    const far = 500.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './resources/posx.jpg',
      './resources/negx.jpg',
      './resources/posy.jpg',
      './resources/negy.jpg',
      './resources/posz.jpg',
      './resources/negz.jpg',
    ]);
    this._scene.background = texture;

    for (let x = -2; x < 2; x++) {
      for (let y = -2; y < 2; y++) {
        this.boxes.push(new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load('./resources/tex.jpg'),
            aoMap: new THREE.TextureLoader().load('./resources/ao.jpg'),
            normalMap: new THREE.TextureLoader().load('./resources/normal.jpg'),
            roughnessMap: new THREE.TextureLoader().load('./resources/roughness.jpg'),
          })));
       // this.boxes[this.boxes.length - 1].position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5);
        this.boxes[this.boxes.length - 1].position.set((x * 5), 8 + (Math.random() * 1.5), (y * 5) + 50);
        this.boxes[this.boxes.length - 1].castShadow = true;
        this.boxes[this.boxes.length - 1].receiveShadow = true;
        this._scene.add(this.boxes[this.boxes.length - 1]);
      }
    }

    this._camera.position.set(-2, 8, 37);
    this._RAF();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth - 10, window.innerHeight - 10);
  }

  _RAF() {
    let dt = this.clock.getDelta();
    let speed = 1.5 * dt;
    requestAnimationFrame(() => {
      this.boxes.forEach((box) => {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
      });
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          let index = (x * 4) + y;
          let start = new THREE.Vector3((x * 5), 8, (y * 5) + 50);
          let end = new THREE.Vector3((x * 5), 8, (y * 5));
          Animation.interpolate(this.boxes[index], start, end, speed, 'position');
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});
