import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import THREEx from './volumetricspotlight/threex.volumetricspotlightmaterial';
import Random from './Random';

function createTargetPoint(position) {
  const defaultPosition = {
    x: 0,
    y: 0,
    z: 0,
  };
  const { x, y, z } = { ...defaultPosition, ...position };
  const targetSpotLight = new THREE.Mesh(
    new THREE.CircleGeometry(0, 0),
    new THREE.MeshBasicMaterial(),
  );

  targetSpotLight.position.set(x, y, z);
  return targetSpotLight;
}

class Laser {
  constructor(config) {
    this.config = config;
    this.direction = config.direction;
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
  }

  createMesh() {
    const {
      color,
      position,
      target,
    } = this.config;

    const geometry	= new THREE.CylinderGeometry(1, 1, 6000, 20, 20, true);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    const material	= new THREEx.VolumetricSpotLightMaterial();
    const mesh	= new THREE.Mesh(geometry, material);
    this.spotLightTarget = createTargetPoint(target);
    mesh.position.set(position.x, position.y, position.z);

    mesh.lookAt(this.spotLightTarget.position);
    material.uniforms.lightColor.value.set(color);
    material.uniforms.spotPosition.value	= mesh.position;
    material.uniforms.anglePower.value = Random(1.2, 3);
    material.uniforms.attenuation.value = 5000;

    const spotLight	= new THREE.SpotLight();
    spotLight.position.copy(mesh.position);
    spotLight.color	= mesh.material.uniforms.lightColor.value;
    spotLight.exponent	= 1;
    spotLight.angle	= 0.1;
    spotLight.intensity	= 0.1;

    spotLight.target = this.spotLightTarget;
    this.laser = mesh;
    this.animate();
    return [spotLight, mesh, this.spotLightTarget];
  }

  animate() {
    tween(this.laser, this.direction);
    setTimeout(this.animate, 1500);
  }

  render() {
    TWEEN.update();
  }
}

const directionMapping = {
  left: () => ({ x: Random(Math.PI / -4, Math.PI / -25), y: Random(Math.PI / -4, Math.PI / -6) }),
  right: () => ({ x: Random(Math.PI / -4, Math.PI / -25), y: Random(Math.PI / 4, Math.PI / 6) }),
  back: () => ({ x: Random(Math.PI / -4, Math.PI / -25), y: Random(Math.PI / -6, Math.PI / 6) }),
};

function tween(laser, direction) {
  const { x, y } = directionMapping[direction]();

  new TWEEN.Tween(laser.rotation)
    .to({
      x,
      y,
      z: 0,
    }, 1400)
    .easing(TWEEN.Easing.Linear.None)
    .start();
}

export default Laser;
