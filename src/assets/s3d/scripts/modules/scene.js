import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function getCameraPosition(hdCameraPosition) {
  const getActualValue = (width => {
    const cof = 1920 / width;
    const fnDesktop = defaultValue => defaultValue * cof;
    const fnTablet = defaultValue => defaultValue * (cof / 2);
    const fnMobile = defaultValue => defaultValue * (cof / 2.7);

    switch (true) {
        case width >= 1024:
          return fnDesktop;
        case width >= 768:
          return fnTablet;
        case width >= 320:
          return fnMobile;
        default:
          throw new Error(`unknown screen width: ${width}`);
    }
  })(window.innerWidth);

  const cameraPosition = [
    getActualValue(hdCameraPosition.x),
    getActualValue(hdCameraPosition.y),
    getActualValue(hdCameraPosition.z),
  ];
  return cameraPosition;
}

export default function createScene() {
  THREE.Cache.enabled = true;

  let container;
  let camera;
  let scene;
  let renderer;
  let targetRotation = 0;
  let targetRotationOnPointerDown = 0;

  let pointerX = 0;
  let pointerXOnPointerDown = 0;

  let windowHalfX = window.innerWidth / 2;

  const parameters = init();
  return parameters;

  function init() {
    container = document.getElementById('scene');

    // CAMERA
    const hdCameraPosition = {
      x: 0,
      y: 150,
      z: 800,
    };

    const cameraPosition = getCameraPosition(hdCameraPosition);
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(...cameraPosition);

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000104);
    camera.lookAt(0, 130, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    // renderer.shadowMap.enabled	= true;
    // renderer.shadowMap.renderReverseSided = false;
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
    controls.maxDistance = 1500;
    controls.minDistance = 700;
    controls.enableRotate = false;
    controls.zoomSpeed = 0.1;
    // EVENTS
    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', onPointerDown);

    window.addEventListener('resize', () => onWindowResize(hdCameraPosition));

    return {
      scene, camera, renderer,
    };
  }

  function onWindowResize(hdCameraPosition) {
    windowHalfX = window.innerWidth / 2;
    const cameraPosition = getCameraPosition(hdCameraPosition);
    camera.position.set(...cameraPosition);
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
}
