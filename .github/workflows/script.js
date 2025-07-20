const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Add ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

const loader = new THREE.GLTFLoader();

// Load 3D heart model
loader.load('assets/heart.glb', function (gltf) {
  const heart = gltf.scene;
  heart.scale.set(1.5, 1.5, 1.5);  // Scale the heart to the correct size

  // Position the heart at the center of the scene
  heart.position.set(0, 0, 0);  // This ensures the heart is at the center of the scene

  // Rotate the heart slightly for a dynamic effect
  heart.rotation.set(Math.PI / 4, Math.PI / 4, 0);

  scene.add(heart);

  // Add particle system
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 1.5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    colors[i * 3] = 1;
    colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
    colors[i * 3 + 2] = Math.random();
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    opacity: 0.8,
    transparent: true
  });

  const particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);

  // Animate the scene
  function animate() {
    requestAnimationFrame(animate);
    heart.rotation.y += 0.01;
    particleSystem.rotation.y -= 0.003;
    renderer.render(scene, camera);
  }
  animate();
});

// Adjust camera position for a clear view of the heart
camera.position.z = 3;  // Make sure the camera is far enough to view the entire heart

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
