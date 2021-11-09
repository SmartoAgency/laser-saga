import i18next from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import createScene from './modules/scene';
import {
  loadFontAsync,
  createText,
} from './modules/createrTextObject';
import DynamicPoints from './modules/dynamicPoints';
import CreateScreen from './modules/screen';
import { CreateLight, CreateLight2 } from './modules/light';
import loadTextAsync from './modules/loadTextObject';
import createPlatform from './modules/platform';

document.addEventListener('DOMContentLoaded', global => {
  appInit();
});

window.nameProject = 'lazer-saga';
window.defaultProjectPath = `/wp-content/themes/${window.nameProject}`;
window.defaultModulePath = `${defaultProjectPath}/assets/s3d`;
// window.status = 'local';
window.status = 'dev';
// window.status = 'prod';


async function appInit() {
  const {
    scene,
    camera,
    renderer,
  } = createScene();

  const text = `LASER
 SAGA`;
  const groupText = await loadTextAsync();
  // const font = await loadFontAsync();
  // const groupText = createText(font, text);
  const dynamicPoints = new DynamicPoints(scene, renderer, camera, groupText);
  const meshText = dynamicPoints.create();
  scene.add(meshText);

  const configScreen1 = {
    selector: '.js-video1',
    width: 640,
    height: 360,
    x: -800,
    y: 150,
    z: -300,
    ry: Math.PI / 2.5,
  };
  const configScreen2 = {
    selector: '.js-video1',
    width: 640,
    height: 360,
    x: 0,
    y: 150,
    z: -800,
    ry: 0,
  };
  const configScreen3 = {
    selector: '.js-video1',
    width: 640,
    height: 360,
    x: 800,
    y: 150,
    z: -300,
    ry: Math.PI / -2.5,
  };
  const screen1 = CreateScreen(configScreen1);
  const screen2 = CreateScreen(configScreen2);
  const screen3 = CreateScreen(configScreen3);

  scene.add(screen1);
  scene.add(screen2);
  scene.add(screen3);

  const configSpotLight1 = {
    position: {
      x: 500,
      y: 600,
      z: -650,
    },
    color: 0xFFFF00,
    pointTargetPosition: {
      x: 300,
      y: 0,
      z: 150,
    },
    animate: {
      x: 180,
      y: 200,
      time: 0.4,
    },
  };
  const configSpotLight2 = {
    position: {
      x: 500,
      y: 600,
      z: 650,
    },
    color: 0x7F00FF,
    pointTargetPosition: {
      x: 50,
      y: 0,
      z: 450,
    },
    animate: {
      x: 190,
      y: 175,
      time: 0.16,
    },
  };
  const configSpotLight3 = {
    position: {
      x: -500,
      y: 600,
      z: 650,
    },
    color: 0x7F00FF,
    pointTargetPosition: {
      x: -200,
      y: 0,
      z: -350,
    },
    animate: {
      x: 200,
      y: 160,
      time: 0.25,
    },
  };
  const configSpotLight4 = {
    position: {
      x: -500,
      y: 600,
      z: -650,
    },
    color: 0xffffff,
    pointTargetPosition: {
      x: -300,
      y: 0,
      z: 250,
    },
    animate: {
      x: 190,
      y: 210,
      time: 0.3,
    },
  };

  const light1 = new CreateLight(renderer, scene, camera, configSpotLight1);
  scene.add(...light1.createMeshes());
  const light2 = new CreateLight(renderer, scene, camera, configSpotLight2);
  scene.add(...light2.createMeshes());
  const light3 = new CreateLight(renderer, scene, camera, configSpotLight3);
  scene.add(...light3.createMeshes());
  const light4 = new CreateLight(renderer, scene, camera, configSpotLight4);
  scene.add(...light4.createMeshes());

  const platform = createPlatform({
    x: 0,
    y: 0,
    z: 0,
    ry: -Math.PI / 2,
  });
  const backgroundForScene = createPlatform({
    x: 0,
    y: -2,
    z: 0,
    ry: -Math.PI / 2,
    radius: 20000,
    color: 0x000104,
  });
  scene.add(platform, backgroundForScene);
  renderer.render(scene, camera);
  animate();

  function animate() {
    requestAnimationFrame(animate);

    renderer.clear();
    dynamicPoints.render();
    light1.render();
    light2.render();
    light3.render();
    light4.render();
    renderer.render(scene, camera);
  }
}
