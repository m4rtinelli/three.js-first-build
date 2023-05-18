import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
/**
 * Base
 */

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const font = fontLoader.load("/fonts/mechanoid_Regular.json", (font) => {
  const textGeometry = new TextGeometry("life", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.computeBoundingBox();
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});
const knotGeometry = new THREE.BoxGeometry(0.3, 0.08);
const knotMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});
const knots = [];
for (let i = 0; i < 300; i++) {
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);

  knot.position.x = (Math.random() - 0.5) * 10;
  knot.position.y = (Math.random() - 0.5) * 10;
  knot.position.z = (Math.random() - 0.5) * 10;

  knot.rotation.x = Math.random() * Math.PI;
  knot.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  knot.scale.x = scale;
  knot.scale.y = scale;
  knot.scale.z = scale;

  scene.add(knot);
  knots.push(knot);
}

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update knot
  for (let i = 0; i < knots.length; i++) {
    const knot = knots[i];
    knot.rotation.x += 0.01;
    knot.rotation.y += 0.01;
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
