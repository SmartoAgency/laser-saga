import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default function dynamicPoints(scene, renderer, camera, textObject) {
  let mesh;
  let parent;
  const meshes = [];
  // const clonemeshes = [];
  let composer;
  let effectFocus;
  const clock = new THREE.Clock();

  init();
  animate();


  function init() {
    parent = new THREE.Object3D();
    scene.add(parent);
    // const loader = new OBJLoader();

    // loader.load('assets/models/obj/female/female02.obj', object => {
      // const positions = combineBuffer(object, 'position');
      // createMesh(positions, 4.05, -500, -350, 600, 0xff7744);
      // createMesh(positions, 4.05, 500, -350, 0, 0xff5522);
    // });
    //
    // loader.load('models/obj/female02/female02.obj', object => {
    //   const positions = combineBuffer(object, 'position');
    //
    //   createMesh(positions, scene, 4.05, -1000, -350, 0, 0xffdd44);
    //   createMesh(positions, scene, 4.05, 0, -350, 0, 0xffffff);
    // });
    const positions = combineBuffer(textObject, 'position');
    createMesh(positions, 1, -150, 10, 0, 0xffdd44);
    // createMesh(positions, scene, 4.05, 0, -350, 0, 0xffffff);

    const grid = new THREE.Points(new THREE.PlaneGeometry(15000, 15000, 64, 64), new THREE.PointsMaterial({
      color: 0xff0000,
      size: 3,
    }));
    grid.position.y = 0;
    grid.rotation.x = -Math.PI / 2;
    parent.add(grid);

    // postprocessing

    const renderModel = new RenderPass(scene, camera);
    const effectBloom = new BloomPass(0.75);
    const effectFilm = new FilmPass(0.5, 0.5, 1448, false);
    // const effectFilm = new FilmPass(0.5, 0.5, 1448, false);

    effectFocus = new ShaderPass(FocusShader);

    effectFocus.uniforms['screenWidth'].value = window.innerWidth * window.devicePixelRatio;
    effectFocus.uniforms['screenHeight'].value = window.innerHeight * window.devicePixelRatio;
    // effectFocus.renderToScreen = true;

    composer = new EffectComposer(renderer);

    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);
    composer.addPass(effectFocus);

    window.addEventListener('resize', onWindowResize);

    // return parent;
  }

  function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    camera.lookAt(scene.position);

    // renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    effectFocus.uniforms['screenWidth'].value = window.innerWidth * window.devicePixelRatio;
    effectFocus.uniforms['screenHeight'].value = window.innerHeight * window.devicePixelRatio;
  }

  function combineBuffer(model, bufferName) {
    let count = 0;
    model.traverse(child => {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];
        count += buffer.array.length;
      }
    });

    const combined = new Float32Array(count);
    let offset = 0;

    model.traverse(child => {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];

        combined.set(buffer.array, offset);
        offset += buffer.array.length;
      }
    });

    return new THREE.BufferAttribute(combined, 3);
  }

  function createMesh(positions, scale, x, y, z, color) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positions.clone());
    geometry.setAttribute('initialPosition', positions.clone());

    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

    const clones = [
      [0, 0, 0],
    ];

    for (let i = 0; i < clones.length; i++) {
      const c = (i < clones.length - 1) ? 0x252525 : color;

      mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 3, color: 0xffffff }));
      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

      mesh.position.x = x + clones[i][0];
      mesh.position.y = y + clones[i][1];
      mesh.position.z = z + clones[i][2];

      parent.add(mesh);

      // clonemeshes.push({ mesh, speed: 0.5 + Math.random() });
    }
    meshes.push({
      mesh,
      verticesDown: 0,
      verticesUp: 0,
      direction: 0,
      speed: 25,
      delay: 180,
      start: 120,
    });
    // meshes.push({
    //   mesh,
    //   verticesDown: 0,
    //   verticesUp: 0,
    //   direction: 0,
    //   speed: 25,
    //   delay: Math.floor(100 + 200 * Math.random()),
    //   start: Math.floor(100 + 200 * Math.random()),
    // });
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    let delta = 12 * clock.getDelta();
    delta = delta < 2 ? delta : 2;

    for (let j = 0; j < meshes.length; j++) {
      const data = meshes[j];
      const positions = data.mesh.geometry.attributes.position;
      const initialPositions = data.mesh.geometry.attributes.initialPosition;

      const { count } = positions;

      if (data.start > 0) {
        data.start -= 1;
      } else if (data.direction === 0) {
        data.direction = -1;
      }

      for (let i = 0; i < count; i++) {
        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        // falling down
        if (data.direction < 0) {
          if (py > 0) {
            positions.setXYZ(
              i,
              px + 1.5 * (0.50 - Math.random()) * data.speed * delta,
              py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
              pz + 1.5 * (0.50 - Math.random()) * data.speed * delta,
            );
          } else {
            data.verticesDown += 1;
          }
        }

        // rising up
        if (data.direction > 0) {
          const ix = initialPositions.getX(i);
          const iy = initialPositions.getY(i);
          const iz = initialPositions.getZ(i);

          const dx = Math.abs(px - ix);
          const dy = Math.abs(py - iy);
          const dz = Math.abs(pz - iz);

          const d = dx + dy + dx;

          if (d > 1) {
            positions.setXYZ(
              i,
              px - (px - ix) / dx * data.speed * delta * (0.85 - Math.random()),
              py - (py - iy) / dy * data.speed * delta * (0.1 + Math.random()),
              pz - (pz - iz) / dz * data.speed * delta * (0.85 - Math.random()),
            );
          } else {
            data.verticesUp += 1;
          }
        }
      }

      // all vertices down
      if (data.verticesDown >= count) {
        if (data.delay <= 0) {
          data.direction = 1;
          data.speed = 25;
          data.verticesDown = 0;
          data.delay = 360;
        } else {
          data.delay -= 1;
        }
      }

      // all vertices up
      if (data.verticesUp >= count) {
        if (data.delay <= 0) {
          data.direction = -1;
          data.speed = 25;
          data.verticesUp = 0;
          data.delay = 180;
        } else {
          data.delay -= 1;
        }
      }

      positions.needsUpdate = true;
    }

    composer.render(0.01);
  }
}
