import * as THREE from 'three';

export default function CreateScreen(config) {
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
  } = { ...defaultConfig, ...config };
  const video = document.querySelector('.js-video1');
  video.play();
  const texture = new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(plane, material);

  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  return mesh;
}
