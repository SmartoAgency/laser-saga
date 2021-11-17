import * as THREE from 'three';

export default class DynamicPoints {
  constructor(scene, renderer, camera, textObject) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.textObject = textObject;
    this.render = this.render.bind(this);
  }

  clock = new THREE.Clock();

  create() {
    const parent = new THREE.Object3D();
    const positions = combineBuffer(this.textObject, 'position');
    const { mesh, meshConfig } = createMesh(positions, 1, 0, 10, 0, 0xffffff);
    this.mesh = mesh;
    this.meshConfig = meshConfig;
    parent.add(this.mesh);

    const grid = new THREE.Points(new THREE.PlaneGeometry(15000, 15000, 64, 64), new THREE.PointsMaterial({
      color: 0xff0000,
      size: 6,
    }));
    grid.position.y = 0;
    grid.position.z = -5000;
    grid.rotation.x = -Math.PI / 2;
    parent.add(grid);
    return parent;
  }

  render() {
    let delta = 9 * this.clock.getDelta();
    delta = delta < 2 ? delta : 2;

    const data = this.meshConfig;
    const positions = this.mesh.geometry.attributes.position;
    const initialPositions = this.mesh.geometry.attributes.initialPosition;

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
        data.speed = 15;
        data.verticesUp = 0;
        data.delay = 180;
      } else {
        data.delay -= 1;
      }
    }

    positions.needsUpdate = true;
  }
}

function createMesh(positions, scale, x, y, z, color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', positions.clone());
  geometry.setAttribute('initialPosition', positions.clone());

  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

  const c = color ?? 0x252525;
  const mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 3, color: c }));
  mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

  mesh.position.x = x + 0;
  mesh.position.y = y + 0;
  mesh.position.z = z + 0;

  const meshConfig = {
    verticesDown: 0,
    verticesUp: 0,
    direction: 0,
    speed: 15,
    delay: 180,
    start: 120,
  };
  return { mesh, meshConfig };
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
