import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000020); // Alien night atmosphere

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(15, 15, 20); // Positioned for a wide view of the alien world

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows for depth
document.body.appendChild(renderer.domElement);

// Ground (Alien Terrain)
const terrain = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: false })
);
terrain.rotation.x = -Math.PI / 2;
terrain.receiveShadow = true;
scene.add(terrain);

// Fog for atmosphere
scene.fog = new THREE.Fog(0x111133, 15, 50);

// Ambient and Directional Lights
const ambientLight = new THREE.AmbientLight(0x6666ff, 0.2); // Slightly bluish ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Rotating Crystals
const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0x66ffcc, emissive: 0x33ffee });

for (let i = 0; i < 10; i++) {
  const crystal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 1, 5, 6), // Pointy cylinder
    crystalMaterial
  );
  crystal.position.set(
    Math.random() * 40 - 20,
    2.5,
    Math.random() * 40 - 20
  );
  crystal.rotation.y = Math.random() * Math.PI; // Random rotation
  crystal.castShadow = true;
  scene.add(crystal);

  // Animate rotation
  crystal.userData = {
    rotateSpeed: Math.random() * 0.02 + 0.01,
  };
}

// Glowing Orbs (Firefly-like objects)
const orbs = [];
for (let i = 0; i < 15; i++) {
  const orb = new THREE.PointLight(0xffff44, 2, 5);
  orb.position.set(
    Math.random() * 40 - 20,
    Math.random() * 5 + 1,
    Math.random() * 40 - 20
  );
  scene.add(orb);
  orbs.push({
    light: orb,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    ),
  });
}

// Alien Artifact (Interactive Object)
const artifactMaterial = new THREE.MeshStandardMaterial({ color: 0xff33cc, emissive: 0xaa0033 });
const artifact = new THREE.Mesh(
  new THREE.DodecahedronGeometry(2),
  artifactMaterial
);
artifact.position.set(0, 2, 0);
artifact.castShadow = true;
scene.add(artifact);

// Raycaster and Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onClick = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(artifact, true);

  if (intersects.length > 0) {
    artifact.material.emissive.set(0x33ff33); // Change color temporarily
    setTimeout(() => artifact.material.emissive.set(0xaa0033), 300);
  }
};

window.addEventListener("click", onClick);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate crystals
  scene.traverse((object) => {
    if (object.geometry && object.userData.rotateSpeed) {
      object.rotation.y += object.userData.rotateSpeed;
    }
  });

  // Move orbs
  orbs.forEach(({ light, velocity }) => {
    light.position.add(velocity);
    if (light.position.y < 1 || light.position.y > 6) velocity.y *= -1;
    if (light.position.x < -20 || light.position.x > 20) velocity.x *= -1;
    if (light.position.z < -20 || light.position.z > 20) velocity.z *= -1;
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
