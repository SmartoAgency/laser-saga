import * as THREE from 'three';

export default function createPlatform(config) {
  const { x, y, z, ry } = config;
  const grid = new THREE.Mesh(
    new THREE.CircleGeometry(500, 100),
    new THREE.MeshPhongMaterial({ color: 0x262627 }),
  );
  grid.position.x = x;
  grid.position.y = y;
  grid.position.z = z;
  grid.rotation.x = ry;
  return grid;
}
