import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffc8a3);
scene.fog = new THREE.Fog(0xd56b4f, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(20, 10, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x8b3e3e })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffd4a6, 0.6);
sunlight.position.set(10, 20, -5);
scene.add(sunlight);

// Restricted Area (Shrine Center)
let restrictedArea = {
  x: 0,
  z: 0,
  radius: 15
};

// Check if a position is outside the restricted area
function isOutsideRestrictedArea(x, z) {
  const dx = x - restrictedArea.x;
  const dz = z - restrictedArea.z;
  return Math.sqrt(dx * dx + dz * dz) >= restrictedArea.radius;
}

// Get a random position outside the restricted area
function getRandomPositionOutsideRestrictedArea() {
  let x, z;
  do {
    x = Math.random() * 50 - 25;
    z = Math.random() * 50 - 25;
  } while (!isOutsideRestrictedArea(x, z));
  return { x, z };
}

// Load Shrine Model
const loader = new GLTFLoader();
loader.load(
  'https://trystan211.github.io/test_joshua/fox_stone_statue_handpainted_kitsune.glb',
  (gltf) => {
    const shrine = gltf.scene;

    shrine.position.set(restrictedArea.x, -0.5, restrictedArea.z);
    shrine.scale.set(170, 170, 170);
    scene.add(shrine);

    // Calculate bounding box and update restricted radius
    const boundingBox = new THREE.Box3().setFromObject(shrine);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    restrictedArea.radius = Math.max(size.x, size.z) / 2 + 10;
    console.log(`Restricted area radius updated: ${restrictedArea.radius}`);
  },
  undefined,
  (error) => console.error('Error loading shrine model:', error)
);

// Trees and Mushrooms
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b341c });
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0xd35f45 });
const mushroomMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

for (let i = 0; i < 20; i++) {
  const position = getRandomPositionOutsideRestrictedArea();

  // Tree trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 8),
    trunkMaterial
  );
  trunk.position.set(position.x, 4, position.z);

  // Tree foliage
  for (let j = 0; j < 4; j++) {
    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(5 - j * 1.5, 4),
      leafMaterial
    );
    foliage.position.set(position.x, 8 + j * 2.5, position.z);
    scene.add(foliage);
  }

  // Mushrooms at the base
  for (let j = 0; j < 3; j++) {
    const mushroom = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.6, 12),
      mushroomMaterial
    );
    mushroom.position.set(
      position.x + Math.random() * 1.5 - 0.75,
      0.3,
      position.z + Math.random() * 1.5 - 0.75
    );
    scene.add(mushroom);
  }

  scene.add(trunk);
}

// Load Fox Models
loader.load(
  'https://trystan211.github.io/test_joshua/low_poly_fox.glb',
  (gltf) => {
    for (let i = 0; i < 5; i++) {
      const position = getRandomPositionOutsideRestrictedArea();
      const rotationY = Math.random() * Math.PI * 2;

      const fox = gltf.scene.clone();
      fox.position.set(position.x, 1, position.z);
      fox.rotation.y = rotationY;
      fox.scale.set(1, 1, 1);
      scene.add(fox);
    }
  },
  undefined,
  (error) => console.error('Error loading fox model:', error)
);

// Rocks
const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.9,
  metalness: 0.1
});

for (let i = 0; i < 15; i++) {
  const position = getRandomPositionOutsideRestrictedArea();

  const rock = new THREE.Mesh(
    new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 1),
    rockMaterial
  );
  rock.position.set(position.x, 0.5, position.z);
  scene.add(rock);
}

// Red Rain Particles
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
  color: 0xb94e48,
  size: 0.5,
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

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
