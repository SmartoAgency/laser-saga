import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import createScene from './modules/scene';
import DynamicPoints from './modules/dynamicPoints';
import { CreateVideoScreen, CreatePosterScreen } from './modules/screen';
import loadTextAsync from './modules/loadTextObject';
import createPlatform from './modules/platform';
import Laser from './modules/laser';

document.addEventListener('DOMContentLoaded', global => {
  appInit();
});

window.nameProject = 'lazer-saga';
window.defaultProjectPath = `/wp-content/themes/${window.nameProject}`;
window.defaultModulePath = `${defaultProjectPath}/assets/s3d`;
// window.status = 'local';
window.status = 'dev';
// window.status = 'prod';

function getCurrentBrowser(agent) {
  if (agent.match(/chrome|chromium|crios/i)) {
    return 'chrome';
  } else if (agent.match(/firefox|fxios/i)) {
    return 'firefox';
  } else if (agent.match(/safari/i)) {
    return 'safari';
  } else if (agent.match(/opr\//i)) {
    return 'opera';
  } else if (agent.match(/edg/i)) {
    return 'edge';
  } else {
    return 'other';
  }
}

async function appInit() {
  const configMapping = {
    safari: () => ({
      screen: [
        {
          type: 'video',
          selector: '.js-test',
          width: 640,
          height: 360,
          x: -800,
          y: 150,
          z: -300,
          ry: Math.PI / 2.5,
        },
        {
          type: 'video',
          selector: '.js-video',
          width: 640,
          height: 360,
          x: 0,
          y: 150,
          z: -800,
          ry: 0,
        },
        {
          type: 'video',
          selector: '.js-test',
          width: 640,
          height: 360,
          x: 800,
          y: 150,
          z: -300,
          ry: Math.PI / -2.5,
        },
      ],
    }),
    default: () => ({
      screen: [
        {
          type: 'video',
          selector: '.js-video',
          width: 640,
          height: 360,
          x: -800,
          y: 150,
          z: -300,
          ry: Math.PI / 2.5,
        },
        {
          type: 'video',
          selector: '.js-video',
          // width: 640,
          // height: 360,
          width: 960,
          height: 540,
          x: 0,
          y: 150,
          z: -800,
          ry: 0,
        },
        {
          type: 'video',
          selector: '.js-video',
          width: 640,
          height: 360,
          x: 800,
          y: 150,
          z: -300,
          ry: Math.PI / -2.5,
        },
      ],
    }),
  };

  const browser = getCurrentBrowser(navigator.userAgent);

  const {
    scene,
    camera,
    renderer,
  } = createScene();
  const parent = new THREE.Object3D();
  scene.add(parent);
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

  const groupText = await loadTextAsync();
  const dynamicPoints = new DynamicPoints(scene, renderer, camera, groupText);
  const meshText = dynamicPoints.create();
  parent.add(meshText);

  // mouse move start
  const mouse = {
    x: 0,
    y: 0,
  };

  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  // mouse move end

  // screens create start
  const { screen: screensConfig } = configMapping[browser] ? configMapping[browser]() : configMapping['default']();
  const screenMeshes = screensConfig.map(conf => (conf.type === 'poster' ? CreatePosterScreen(conf) : CreateVideoScreen(conf)));

  parent.add(...screenMeshes);
  // screens create end

  // Lasers Create Start
  const configLaserRight = {
    color: 0x3638EE,
    position: {
      x: 800,
      y: 10,
      z: -300,
    },
    target: {
      x: 800,
      y: 10,
      z: -300,
    },
    direction: 'left',
  };
  const configLaserLeft = {
    color: 0x3638EE,
    position: {
      x: -800,
      y: 10,
      z: -300,
    },
    target: {
      x: 800,
      y: 10,
      z: -300,
    },
    direction: 'right',
  };
  const configLaserMiddle = {
    color: 0xff291a,
    position: {
      x: 0,
      y: 10,
      z: -800,
    },
    target: {
      x: 0,
      y: 10,
      z: -800,
    },
    direction: 'back',
  };
  const countLaserLeft = 5;
  const clonesLaserLeft = [];
  const countLaserRight = 5;
  const clonesLaserRight = [];
  const countLaserMiddle = 5;
  const clonesLaserMiddle = [];

  for (let i = 0; i < countLaserRight; i += 1) {
    const laserRight = new Laser(configLaserRight);
    const laserRightMeshes = laserRight.createMesh();
    parent.add(...laserRightMeshes);
    clonesLaserRight.push(laserRight);
  }
  for (let i = 0; i < countLaserLeft; i += 1) {
    const laserLeft = new Laser(configLaserLeft);
    const laserLeftMeshes = laserLeft.createMesh();
    parent.add(...laserLeftMeshes);
    clonesLaserLeft.push(laserLeft);
  }
  for (let i = 0; i < countLaserMiddle; i += 1) {
    const laserMiddle = new Laser(configLaserMiddle);
    const laserMiddleMeshes = laserMiddle.createMesh();
    parent.add(...laserMiddleMeshes);
    clonesLaserMiddle.push(laserMiddle);
  }
  // Laser Create End
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove);
  window.addEventListener('resize', resize);

  parent.add(backgroundForScene);
  // parent.add(platform, backgroundForScene);
  renderer.render(scene, camera);
  animate();
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

  function firstAnimation() {
    const animationSteps = [
      {
        x: 300,
      },
      {
        x: -300,
      },
      {
        x: 0,
      },
      {
        y: -300,
      },
      {
        y: 300,
      },
      {
        y: 0,
      },
    ];
    const n = { f: 0 };
    const tweens = animationSteps.map(anim => {
      const tween = new TWEEN.Tween(mouse)
        .to(anim, 400);
      return tween;
    });

    const tweenStart = new TWEEN.Tween(n).to({ f: 1 }, 100);
    let prevTween = tweenStart;
    tweens.forEach(tween => {
      prevTween.chain(tween);
      prevTween = tween;
    });
    tweenStart.start();
  }
  firstAnimation();

  function animate() {
    requestAnimationFrame(animate);

    renderer.clear();
    TWEEN.update();
    dynamicPoints.render();
    targetX = mouse.x * 0.0007;
    targetY = mouse.y * 0.0005;

    if (parent) {
      parent.rotation.y += 0.06 * (targetX - parent.rotation.y);
      parent.rotation.x += 0.4 * (targetY - parent.rotation.x);
    }

    renderer.render(scene, camera);
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX - windowHalfX);
    mouse.y = (event.clientY - windowHalfY);
  }

  function onTouchMove(event) {
    mouse.x = (event.targetTouches[0].clientX - windowHalfX) * 6;
    mouse.y = (event.targetTouches[0].clientY - windowHalfY);
  }

  function resize() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
