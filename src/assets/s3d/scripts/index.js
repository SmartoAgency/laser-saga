import i18next from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import createScene from './modules/scene';
import {
  loadFontAsync,
  createText,
} from './modules/createrTextObject';
import dynamicPoints from './modules/dynamicPoints';
import CreateScreen from './modules/screen';
import сreateLight from './modules/light';
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
  const font = await loadFontAsync();
  const groupText = createText(font, text);
  dynamicPoints(scene, renderer, camera, groupText);

  const configScreen1 = {
    selector: '.js-video1',
    width: 480,
    height: 360,
    x: -800,
    y: 150,
    z: -300,
    ry: Math.PI / 2.5,
  };
  const configScreen2 = {
    selector: '.js-video1',
    width: 480,
    height: 360,
    x: 0,
    y: 150,
    z: -800,
    ry: 0,
  };
  const configScreen3 = {
    selector: '.js-video1',
    width: 480,
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
  сreateLight(renderer, scene, camera);

  const platform = createPlatform({
    x: 0,
    y: 0,
    z: 0,
    ry: -Math.PI / 2,
  });
  scene.add(platform);
  renderer.render(scene, camera);
}
