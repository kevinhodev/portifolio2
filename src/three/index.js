import * as THREE from "three";
import {
  DiffuseTexture,
  BumpTexture,
  SpecularTexture,
} from "../assets/textures/earth";

const canvas = document.querySelector(".canvas");

let scrollY = 0;
let scale = 0;
const objectsDistance = 4;

window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    scale += event.deltaY * -0.01;

    scale = Math.min(Math.max(0.125, scale), window.innerWidth);
    scrollY = scale;
  },
  { passive: false }
);

const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

// Scene
const scene = new THREE.Scene();

/** Meshes
 *
 */
const diffuse = new THREE.TextureLoader().load(DiffuseTexture);
const bump = new THREE.TextureLoader().load(BumpTexture);
const specular = new THREE.TextureLoader().load(SpecularTexture);

const geometry = new THREE.SphereGeometry(2, 48, 32);
const material = new THREE.MeshPhongMaterial({
  map: diffuse,
  bumpMap: bump,
  bumpScale: 0.5,
  specularMap: specular,
  specular: new THREE.Color("gray"),
  shininess: 0.2,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.z = -18;
sphere.position.x = 6;
sphere.position.y = 2;
scene.add(sphere);

/**
 * Particles
 */
// Geometry
const particlesCount = 20000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * window.innerWidth;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: "#ffeded",
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight, ambientLight);

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

// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setClearAlpha(0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  sphere.rotation.y += deltaTime * 0.6;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  cameraGroup.position.x += scrollY * deltaTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
