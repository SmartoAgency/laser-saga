import * as THREE from 'three';

export default function createPlatform(config) {
  const {
    x,
    y,
    z,
    ry,
    radius = 500,
    segments = 100,
    color = 0x262627,
  } = config;
  const grid = new THREE.Mesh(
    new THREE.CircleGeometry(radius, segments),
    new THREE.MeshPhongMaterial({ color }),
  );
  grid.position.x = x;
  grid.position.y = y;
  grid.position.z = z;
  grid.rotation.x = ry;
  return grid;
}
