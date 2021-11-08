import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default function createScene() {

  THREE.Cache.enabled = true;

  let container;
  let camera;
  let cameraTarget;
  let scene;
  let renderer;
  let targetRotation = 0;
  let targetRotationOnPointerDown = 0;

  let pointerX = 0;
  let pointerXOnPointerDown = 0;

  let windowHalfX = window.innerWidth / 2;

  const parameters = init();
  animate();
  return parameters;

  function init() {
    container = document.getElementById('scene');

    // CAMERA

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 700, 1500);
    cameraTarget = new THREE.Vector3(0, 200, 0);

    // SCENE

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
    scene.background = new THREE.Color(0x000104);
    // scene.fog = new THREE.FogExp2(0xffffff, 0.000275);
    scene.fog = new THREE.FogExp2(0x000104, 0.0000675);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.shadowMap.enabled	= true;
    // LIGHTS

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(0, 800, 90);
    scene.add(pointLight);

    // RENDERER


    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    // EVENTS
    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', onPointerDown);

    window.addEventListener('resize', onWindowResize);

    return {
      scene, camera, renderer, pointLight,
    };
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //
  function onPointerDown(event) {
    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(event) {
    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
  }

  function onPointerUp() {
    if (event.isPrimary === false) return;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    // camera.position.x += (targetRotation - camera.position.x) * 0.05;

    camera.lookAt(cameraTarget);

    renderer.clear();
    renderer.render(scene, camera);
  }
}
