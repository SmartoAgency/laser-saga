import * as THREE from 'three';

export function CreateVideoScreen(config) {
  const defaultConfig = {
    width: 480,
    height: 360,
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
  };
  const {
    width,
    height,
    x,
    y,
    z,
    ry,
    selector,
  } = { ...defaultConfig, ...config };
  const video = document.querySelector(selector);
  if (video) video.play();

  const texture = new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(plane, material);

  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  return mesh;
}

export function CreatePosterScreen(config) {
  const defaultConfig = {
    width: 480,
    height: 360,
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
  };
  const {
    width,
    height,
    x,
    y,
    z,
    ry,
    selector,
  } = { ...defaultConfig, ...config };
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`is not found selector: ${selector}`);
  }
  const path = node.getAttribute('src');
  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(plane, material);

  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  return mesh;
}
