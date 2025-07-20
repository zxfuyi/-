const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const loader = new THREE.GLTFLoader();

// Load 3D heart model
loader.load('https://example.com/heart.glb', function (gltf) {
  const heart = gltf.scene;
  heart.scale.set(1.5, 1.5, 1.5);
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

// Adjust camera position
camera.position.z = 5;

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
