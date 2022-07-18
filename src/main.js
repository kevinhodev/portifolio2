import * as THREE from "three";
import gsap from "gsap";
import EarthTexture from "./assets/textures/earth.jpg";

const timeline = gsap.timeline();

/* Animations */

//-- Sidebar --//
timeline.from(".sidebar__logo", {
  duration: 1,
  opacity: 0,
  transform: "translateX(-10rem) rotate(-90deg)",
});
timeline.from(
  ".sidebar__menu ul li",
  {
    duration: 1,
    opacity: 0,
    transform: "translateY(-10rem)",
    stagger: 0.2,
  },
  "-=1"
);
timeline.from(
  ".sidebar__icon",
  {
    duration: 1,
    opacity: 0,
    stagger: 0.2,
  },
  "-=1"
);

//-- Profile --//
timeline.from(
  ".profile-image",
  {
    duration: 1,
    transform: "scale(0)",
  },
  "-=2"
);

//-- Arrow --//
gsap.to(".app__arrow", {
  duration: 1,
  transform: "translateX(2rem)",
  repeat: -1,
  yoyo: true,
  ease: "Sine.easeInOut",
});

const canvas = document.querySelector(".three");

let scrollY = window.scrollY;
const objectsDistance = 4;

window.addEventListener("scroll", () => (scrollY = window.scrollY));

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
const texture = new THREE.TextureLoader().load(EarthTexture);

const geometry = new THREE.SphereGeometry(2, 48, 32);
const material = new THREE.MeshPhongMaterial({
  map: texture,
  shininess: 0,
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
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
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
const ambientLight = new THREE.AmbientLight("#ffffff");
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);

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

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
