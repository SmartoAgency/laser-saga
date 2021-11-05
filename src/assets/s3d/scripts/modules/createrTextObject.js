import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function loadFontAsync() {
  const fontName = 'optimer'; // helvetiker, optimer, gentilis, droid sans, droid serif
  const fontWeight = 'bold'; // normal bold
  const promise = new Promise((resolve, reject) => {
    //   const loader = new TTFLoader();
    //   loader.load('assets/fonts/ttf/LaserFont-Regular.ttf', json => {
    //     font = new Font(json);
    //     const objectText = createText();
    //     resolve(objectText);
    //   });
    const loader = new FontLoader();
    loader.load(`assets/fonts/${fontName}_${fontWeight}.typeface.json`, response => {
      resolve(response);
    }, () => {}, err => {
      console.log(err);
      throw err;
    });
  });
  return promise;
}

function createText(font, text) {
  const height = 2;
  const size = 80;
  const hover = 0;
  const curveSegments = 10;
  const bevelEnabled = true;
  const bevelThickness = 1;
  const bevelOffset = -8;
  const bevelSize = 8;

  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];

  const textGeo = new TextGeometry(text, {
    font,
    size,
    height,
    curveSegments,
    bevelThickness,
    bevelOffset,
    bevelSize,
    bevelEnabled,
  });
  textGeo.translate(0, 200, 200);
  textGeo.computeBoundingBox();

  const centerOffset = (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  const textMesh1 = new THREE.Mesh(textGeo, materials);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI / 2;
  return textMesh1;
}

export {
  loadFontAsync,
  createText,
};
