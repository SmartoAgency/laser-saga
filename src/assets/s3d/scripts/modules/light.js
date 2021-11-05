import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

export default function createLight(renderer, scene, camera) {
  const spotLight1 = createSpotlight(0xFF7F00);
  const spotLight2 = createSpotlight(0x00FF7F);
  const spotLight3 = createSpotlight(0x7F00FF);

  spotLight1.position.set(600, 900, 550);
  spotLight2.position.set(0, 1200, 750);
  spotLight3.position.set(-600, 900, 550);

  const targetSpotLight1 = createTargetPoint(300, 150);
  const targetSpotLight2 = createTargetPoint(50, 400);
  const targetSpotLight3 = createTargetPoint(-200, -300);

  spotLight1.target = targetSpotLight1;
  spotLight2.target = targetSpotLight2;
  spotLight3.target = targetSpotLight3;

  const lightHelper1 = new THREE.SpotLightHelper(spotLight1);
  const lightHelper2 = new THREE.SpotLightHelper(spotLight2);
  const lightHelper3 = new THREE.SpotLightHelper(spotLight3);
  scene.add(spotLight1, spotLight2, spotLight3);
  scene.add(targetSpotLight1, targetSpotLight2, targetSpotLight3);
  scene.add(lightHelper1, lightHelper2, lightHelper3);
  render();
  animate();
  let isEvenAnimation = false;

  function animate() {
    if (isEvenAnimation % 8 === 0) {
      tweenBack(targetSpotLight1);
      tweenBack(targetSpotLight2);
      tweenBack(targetSpotLight3);
      isEvenAnimation = 1;
      setTimeout(animate, 5000);
    } else {
      tween(targetSpotLight1);
      tween(targetSpotLight2);
      tween(targetSpotLight3);
      isEvenAnimation += 1;
      setTimeout(animate, 3000);
    }
    // tween(spotLight1);
    // tween(spotLight2);
    // tween(spotLight3);
  }

  function render() {
    TWEEN.update();

    if (lightHelper1) lightHelper1.update();
    if (lightHelper2) lightHelper2.update();
    if (lightHelper3) lightHelper3.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}

function createTargetPoint(x = 0, z = 0) {
  const targetSpotLight1 = new THREE.Mesh(
    new THREE.CircleGeometry(0, 0),
    new THREE.MeshBasicMaterial(),
  );
  targetSpotLight1.position.x = x;
  targetSpotLight1.position.z = z;
  return targetSpotLight1;
}

function createSpotlight(color) {
  // const newObj = new THREE.PointLight(color, 1);
  const newObj = new THREE.SpotLight(color, 5);

  // newObj.castShadow = true;
  newObj.angle = 0.03;
  newObj.penumbra = 0.1;
  newObj.decay = 1.2;
  newObj.distance = 1500;

  return newObj;
}

function tweenBack(light) {
  new TWEEN.Tween(light.position).to({
    x: 0,
    y: 0,
    z: 150,
  }, 3000)
    .easing(TWEEN.Easing.Quadratic.Out).start();
}
function tween(light) {
  // new TWEEN.Tween(light).to({
  //   angle: (Math.random() * 0.1) + 0.05,
  //   penumbra: Math.random() + 1,
  // }, Math.random() * 1000 + 2000)
  //   .easing(TWEEN.Easing.Quadratic.Out).start();

  new TWEEN.Tween(light.position).to({
    x: (Math.random() * 500) - 150,
    y: 0,
    z: (Math.random() * 500) - 150,
  }, 3000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

  // new TWEEN.Tween(light.target).to({
  //   x: (Math.random() * 30) - 1500,
  //   y: (Math.random() * 10) + 1500,
  //   z: (Math.random() * 30) - 1500,
  // }, Math.random() * 1000 + 2000)
  //   .easing(TWEEN.Easing.Quadratic.Out).start();
}
