import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default function loadFontAsync() {
  const promise = new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load('/wp-content/themes/lazer-saga/assets/models/obj/laser.obj', response => {
      resolve(response);
    }, () => {}, err => {
      console.log(err);
      throw err;
    });
  });
  return promise;
}
