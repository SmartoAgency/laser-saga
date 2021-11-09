import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import THREEx from '../modules/volumetricspotlight/threex.volumetricspotlightmaterial';

// export default function createLight(renderer, scene, camera) {
//   const spotLight1 = createSpotlight(0xFF7F00);
//   const spotLight2 = createSpotlight(0x00FF7F);
//   const spotLight3 = createSpotlight(0x7F00FF);
//
//   const spotLight4 = createSpotlight(0xffffff);
//
//   spotLight1.position.set(500, 600, -650);
//   spotLight2.position.set(500, 600, 650);
//   spotLight3.position.set(-500, 600, 650);
//
//   spotLight4.position.set(-500, 600, -650);
//
//   // far
//   // spotLight1.position.set(600, 900, 550);
//   // spotLight2.position.set(0, 1200, 750);
//   // spotLight3.position.set(-600, 900, 550);
//
//   const targetSpotLight1 = createTargetPoint(300, 150);
//   const targetSpotLight2 = createTargetPoint(50, 400);
//   const targetSpotLight3 = createTargetPoint(-200, -300);
//
//   const targetSpotLight4 = createTargetPoint(-300, 200);
//
//   spotLight1.target = targetSpotLight1;
//   spotLight2.target = targetSpotLight2;
//   spotLight3.target = targetSpotLight3;
//
//   spotLight4.target = targetSpotLight4;
//
//   const lightHelper1 = new THREE.SpotLightHelper(spotLight1);
//   const lightHelper2 = new THREE.SpotLightHelper(spotLight2);
//   const lightHelper3 = new THREE.SpotLightHelper(spotLight3);
//   const lightHelper4 = new THREE.SpotLightHelper(spotLight4);
//
//   scene.add(spotLight1, spotLight2, spotLight3, spotLight4);
//   scene.add(targetSpotLight1, targetSpotLight2, targetSpotLight3, targetSpotLight4);
//   scene.add(lightHelper1, lightHelper2, lightHelper3, lightHelper4);
//   render();
//   animate();
//   let isEvenAnimation = false;
//
//   function animate() {
//     if (isEvenAnimation % 8 === 0) {
//       tweenBack(targetSpotLight1);
//       tweenBack(targetSpotLight2);
//       tweenBack(targetSpotLight3);
//       tweenBack(targetSpotLight4);
//       isEvenAnimation = 1;
//       setTimeout(animate, 5000);
//     } else {
//       tween(targetSpotLight1);
//       tween(targetSpotLight2);
//       tween(targetSpotLight3);
//       tween(targetSpotLight4);
//       isEvenAnimation += 1;
//       setTimeout(animate, 3000);
//     }
//     // tween(spotLight1);
//     // tween(spotLight2);
//     // tween(spotLight3);
//   }
//
//   function render() {
//     TWEEN.update();
//
//     if (lightHelper1) lightHelper1.update();
//     if (lightHelper2) lightHelper2.update();
//     if (lightHelper3) lightHelper3.update();
//     if (lightHelper4) lightHelper4.update();
//
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
//   }
// }

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

function createSpotlight(color) {
  const newObj = new THREE.SpotLight(color, 10);
  newObj.angle = 0.1;
  newObj.penumbra = 0.4;
  newObj.decay = 1.2;
  newObj.distance = 1600;

  return newObj;
}

const CreateLight2 = function CreateLight2(renderer, scene, camera, config) {
  const {
    position: { x, y, z },
    color,
    animate,
  } = config;
  // const spotLight = createSpotlight(color);
  // spotLight.position.set(x, y, z);
  //
  // const targetSpotLight = createTargetPoint(pointTargetPosition);
  // spotLight.target = targetSpotLight;
  //
  // const lightHelper = new THREE.SpotLightHelper(spotLight, color, 3);
  //
  // scene.add(spotLight);
  // scene.add(targetSpotLight);
  // scene.add(lightHelper);
  const onRenderFcts	= [];
  // var geometry	= new THREE.CylinderGeometry( 0.1, 1.5, 5, 32*2, 20, true);
  const geometry	= new THREE.CylinderGeometry(10, 350, 4600, 32 * 20, 200, true);
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0));
  // geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0));
  geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  const material	= new THREEx.VolumetricSpotLightMaterial();
  const newObj	= new THREE.Mesh(geometry, material);
  newObj.position.set(x, y, z);
  newObj.lookAt(new THREE.Vector3(0, 0, 0));
  material.uniforms.lightColor.value.set(color);
  material.uniforms.spotPosition.value	= newObj.position;
  material.uniforms.anglePower.value = 5;
  material.uniforms.attenuation.value = 5000;
  scene.add(newObj);

  const spotLight	= new THREE.SpotLight();
  // spotLight.position.set(x, y, z);
  spotLight.position.copy(newObj.position);
  spotLight.color	= newObj.material.uniforms.lightColor.value;
  spotLight.exponent	= 1;
  spotLight.angle	= Math.PI / 2;
  spotLight.intensity	= 0.1;
  scene.add(spotLight);
  scene.add(spotLight.target);
  // renderer.shadowMapEnabled	= true;

  const light	= spotLight;
  light.castShadow	= true;
  light.shadow.camera.near	= 0.01;
  light.shadow.camera.far	= 15;
  light.shadow.camera.fov	= 1045;

  light.shadow.camera.left	= -8;
  light.shadow.camera.right	= 8;
  light.shadow.camera.top	= 8;
  light.shadow.camera.bottom = -8;

  light.shadow.camera.visible = true;

  light.shadow.bias	= 0.0;
  light.shadow.darkness	= 0.5;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height	= 1024;


  //		animate the volumetric spotLight				//
  onRenderFcts.push((delta, now) => {
    const angle	= animate.time * Math.PI * 2 * now;
    // const angle	= 0.1 * Math.PI * 2 * now;
    const target = new THREE.Vector3(animate.x * Math.cos(angle), 0, animate.y * Math.sin(angle));
    newObj.lookAt(target);
    spotLight.target.position.copy(target);
  });
  onRenderFcts.push(() => {
    renderer.render(scene, camera);
  });

  let lastTimeMsec = null;
  requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || ((nowMsec - 1000) / 60);
    const deltaMsec	= Math.min(2000, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // call each update function
    onRenderFcts.forEach(onRenderFct => {
      onRenderFct(deltaMsec / 1000, nowMsec / 1000);
    });
  });
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
  new TWEEN.Tween(light).to({
    angle: (Math.random() * 0.1) + 0.05,
    penumbra: Math.random() + 1,
  }, Math.random() * 1000 + 2000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

  // new TWEEN.Tween(light.position).to({
  //   x: (Math.random() * 500) - 150,
  //   y: 0,
  //   z: (Math.random() * 500) - 150,
  // }, 3000)
  //   .easing(TWEEN.Easing.Quadratic.Out).start();
  const time = Date.now() * 0.05;
  new TWEEN.Tween(light.position).to({
    x: Math.sin(time * Math.random()) * 200,
    y: 0,
    z: Math.cos(time * Math.random()) * 250,
  }, 3000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

  // new TWEEN.Tween(light.target).to({
  //   x: (Math.random() * 30) - 1500,
  //   y: (Math.random() * 10) + 1500,
  //   z: (Math.random() * 30) - 1500,
  // }, Math.random() * 1000 + 2000)
  //   .easing(TWEEN.Easing.Quadratic.Out).start();
}


// const CreateLight = function CreateLight(renderer, scene, camera, config) {
//   const {
//     position: { x, y, z },
//     color,
//     pointTargetPosition,
//   } = config;
//   const spotLight = createSpotlight(color);
//   spotLight.position.set(x, y, z);
//
//   const targetSpotLight = createTargetPoint(pointTargetPosition);
//   spotLight.target = targetSpotLight;
//
//   const lightHelper = new THREE.SpotLightHelper(spotLight, color, 3);
//
//   scene.add(spotLight);
//   scene.add(targetSpotLight);
//   scene.add(lightHelper);
//
//   render();
//   animate();
//   let isEvenAnimation = false;
//
//   function animate() {
//     if (isEvenAnimation % 8 === 0) {
//       tweenBack(targetSpotLight);
//       isEvenAnimation = 1;
//       setTimeout(animate, 5000);
//     } else {
//       tween(targetSpotLight);
//       isEvenAnimation += 1;
//       setTimeout(animate, 3000);
//     }
//   }
//
//   function render() {
//     TWEEN.update();
//
//     if (lightHelper) lightHelper.update();
//
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
//   }
// };

class CreateLight {
  constructor(renderer, scene, camera, config) {
    this.color = config.color;
    this.position = config.position;
    this.pointTargetPosition = config.pointTargetPosition;
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
  }

  createMeshes() {
    const { x, y, z } = this.position;
    const spotLight = createSpotlight(this.color);
    spotLight.position.set(x, y, z);

    this.targetSpotLight = createTargetPoint(this.pointTargetPosition);
    spotLight.target = this.targetSpotLight;

    this.lightHelper = new THREE.SpotLightHelper(spotLight, this.color, 3);
    this.animate();
    return [spotLight, this.targetSpotLight, this.lightHelper];
  }

  isEvenAnimation = false;

  animate() {
    if (this.isEvenAnimation % 80 === 0) {
      tweenBack(this.targetSpotLight);
      this.isEvenAnimation = 1;
      setTimeout(this.animate, 5000);
    } else {
      tween(this.targetSpotLight);
      this.isEvenAnimation += 1;
      setTimeout(this.animate, 3000);
    }
  }

  render() {
    TWEEN.update();
    this.lightHelper.update();
  }
}

export { CreateLight, CreateLight2 };
