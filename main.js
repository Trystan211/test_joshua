import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010); //Hay nako gipa dark nato kay dark na kaayo tag lablayp

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(10, 10, 15); // Position sa camera para ma focus nato na self love na

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Giset ang size sa renderer base sa screem size
renderer.shadowMap.enabled = true; //enable ang shadows
document.body.appendChild(renderer.domElement); //

// Ground kay tae na white para snow
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true; //Ang ground mu-receive og shadow gikan sa objects
scene.add(ground); // I add nato nis pesbok

// Fog
scene.fog = new THREE.Fog(0xaaaaaa, 10, 50);

// Ambient light na ngit2 murag ako
const ambientLight = new THREE.AmbientLight(0x888888, 0.1);
scene.add(ambientLight);

// Define a "safe radius" around sa snowman
const safeRadius = 5;

// Helper function para mag check kung ang position kay outside the safe radius
const isOutsideSafeRadius = (x, z) => {
  const distance = Math.sqrt(x * x + z * z);
  return distance > safeRadius;
};

// Trees 
const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd }); // Frosted white ni siya men

for (let i = 0; i < 20; i++) { 
  let x, z;
  do {
    x = Math.random() * 40 - 20;
    z = Math.random() * 40 - 20;
  } while (!isOutsideSafeRadius(x, z));

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.5, 3, 16), // Low trunk height
    treeTrunkMaterial
  );
  trunk.position.set(x, 1.5, z); // Adjusted trunk position para reduced height
  trunk.castShadow = true;

  const foliage = new THREE.Mesh(
    new THREE.ConeGeometry(2, 6, 16), // Increased cone height para normal2 tan awon
    coneMaterial
  );
  foliage.position.set(trunk.position.x, trunk.position.y + 3.5, trunk.position.z);
  foliage.castShadow = true;

  scene.add(trunk);
  scene.add(foliage);
}

// Fireflies
const fireflies = [];
for (let i = 0; i < 15; i++) {
  let x, z;
  do {
    x = Math.random() * 40 - 20;
    z = Math.random() * 40 - 20;
  } while (!isOutsideSafeRadius(x, z));

  const firefly = new THREE.PointLight(0xffff00, 2, 7);
  firefly.position.set(
    x,
    Math.random() * 5 + 1, // Random y-position
    z
  );
  scene.add(firefly);
  fireflies.push({
    light: firefly,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
  });
}

// Mushrooms (Red Caps)
const mushroomCapMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cap kay Tae na red
const mushroomStemMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White stem kay gwenchayla

for (let i = 0; i < 50; i++) {
  let x, z;
  do {
    x = Math.random() * 40 - 20;
    z = Math.random() * 40 - 20;
  } while (!isOutsideSafeRadius(x, z));

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.2, 0.5),
    mushroomStemMaterial
  );
  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.3, 8),
    mushroomCapMaterial
  );
  stem.position.set(x, 0.25, z);
  cap.position.set(x, 0.55, z);

  stem.castShadow = true;
  cap.castShadow = true;

  scene.add(stem);
  scene.add(cap);
}

// Snowman
const snowman = new THREE.Group();

// Snowman Base
const base = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
base.position.y = 1.5;

// Snowman Middle
const middle = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
middle.position.y = 3;

// Snowman Head
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
head.position.y = 4.7;

// Snowman Carrot Nose og Nigg Eyes
const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.1, 0.5, 8),
  new THREE.MeshStandardMaterial({ color: 0xff8800 })
);
nose.position.set(0, 4.7, 0.75);
nose.rotation.x = Math.PI / 2;

const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const eye1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.07, 8, 8),
  eyeMaterial
);
eye1.position.set(-0.2, 4.9, 0.6);

const eye2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.07, 8, 8),
  eyeMaterial
);
eye2.position.set(0.2, 4.9, 0.6);

// Snowman Arms na murag noodles
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const arm1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 3),
  armMaterial
);
arm1.position.set(-1.2, 3.5, 0);
arm1.rotation.z = Math.PI / 4;

const arm2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 3),
  armMaterial
);
arm2.position.set(1.2, 3.5, 0);
arm2.rotation.z = -Math.PI / 4;

snowman.add(base, middle, head, nose, eye1, eye2, arm1, arm2);
scene.add(snowman);

// Raycaster og Mouse para sa Interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onClick = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(snowman, true);

  if (intersects.length > 0) {
    snowman.scale.set(1.2, 1.2, 1.2);
    setTimeout(() => snowman.scale.set(1, 1, 1), 300);
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

  fireflies.forEach(({ light, velocity }) => {
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

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
