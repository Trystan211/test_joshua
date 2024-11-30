import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffd7b5); // Warm sunset color
scene.fog = new THREE.Fog(0xffd7b5, 20, 100); // Warm sunset color with near and far distances

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(20, 10, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xb94e48 }) // Autumn red floor
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Sunlight
const sunlight = new THREE.DirectionalLight(0xffe3b8, 1.2);
sunlight.position.set(10, 20, -5);
sunlight.castShadow = true;
sunlight.shadow.mapSize.width = 2048; // Increase shadow map resolution
sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.bias = -0.001; // Adjust shadow bias to prevent artifacts
scene.add(sunlight);

// Autumn Trees
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b341c });
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0xd35f45 });

for (let i = 0; i < 20; i++) {
  const x = Math.random() * 50 - 25;
  const z = Math.random() * 50 - 25;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 8),
    trunkMaterial
  );
  trunk.position.set(x, 4, z);
  trunk.castShadow = true;

  // Layered conical foliage
  for (let j = 0; j < 3; j++) {
    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(5 - j * 2, 4),
      leafMaterial
    );
    foliage.position.set(x, 8 + j * 2, z);
    foliage.castShadow = true;
    scene.add(foliage);
  }

  scene.add(trunk);
}

// Benches
const loader = new GLTFLoader();

loader.load(
  'https://trystan211.github.io/test_joshua/park_bech_low-poly.glb', // Replace with your GLTF model URL for the bench
  (gltf) => {
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;

      const bench = gltf.scene.clone();
      bench.position.set(x, 0, z);
      bench.scale.set(0.5, 0.5, 0.5); // Adjust scale to fit the scene
      bench.castShadow = true;
      bench.receiveShadow = true; // Ensure benches receive shadows
      scene.add(bench);
    }
  },
  undefined,
  (error) => console.error('An error occurred while loading the bench model:', error)
);

// White Crystal-Like Rocks
const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.9,
  metalness: 0.1
});

for (let i = 0; i < 15; i++) {
  const x = Math.random() * 50 - 25;
  const z = Math.random() * 50 - 25;
  const y = 0.5;

  const rock = new THREE.Mesh(
    new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 1),
    rockMaterial
  );
  rock.position.set(x, y, z);
  rock.castShadow = true;
  rock.receiveShadow = true;
  scene.add(rock);
}

// Blue Rain Particles
const particleCount = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions.push(
    Math.random() * 100 - 50, // X
    Math.random() * 50 + 10,  // Y
    Math.random() * 100 - 50 // Z
  );
  velocities.push(0, Math.random() * -0.1, 0); // Falling effect
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0x0077ff,
  size: 0.3,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Animation Loop
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  const positions = particlesGeometry.attributes.position.array;
  const velocities = particlesGeometry.attributes.velocity.array;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] += velocities[i * 3 + 1]; // Y position falls
    if (positions[i * 3 + 1] < 0) {
      positions[i * 3 + 1] = Math.random() * 50 + 10; // Reset particle to top
    }
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
