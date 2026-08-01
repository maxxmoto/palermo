import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('viewer3d');
if (!container) throw new Error('3D viewer container not found');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0.5, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI * 0.7;

scene.add(new THREE.AmbientLight(0x222244, 0.5));
const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(5, 5, 5);
scene.add(key);
const rim = new THREE.DirectionalLight(0x00f2ff, 1.5);
rim.position.set(-3, 1, -3);
scene.add(rim);

const particlesGeo = new THREE.BufferGeometry();
const count = 300;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 8;
    pos[i + 1] = (Math.random() - 0.5) * 8;
    pos[i + 2] = (Math.random() - 0.5) * 4;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.02, transparent: true, opacity: 0.5 }));
scene.add(particles);

const mainGroup = new THREE.Group();
scene.add(mainGroup);

const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.18, 128, 32),
    new THREE.MeshPhysicalMaterial({ color: 0x111122, metalness: 0.9, roughness: 0.15, clearcoat: 0.3, clearcoatRoughness: 0.2 })
);
mainGroup.add(knot);

const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.72, 0.2, 64, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.15 })
);
mainGroup.add(wire);

const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.03, 32, 100),
    new THREE.MeshStandardMaterial({ color: 0x00f2ff, metalness: 0.5, roughness: 0.3, emissive: 0x002233, emissiveIntensity: 0.5 })
);
ring.rotation.x = Math.PI / 2;
mainGroup.add(ring);

const textures = ['jacket.webp', 'moto1.webp', 'glovo.webp', 'tufli.webp'];
const cards = [];
const loader = new THREE.TextureLoader();

textures.forEach((src, i) => {
    const angle = (i / textures.length) * Math.PI * 2;
    const geo = new THREE.PlaneGeometry(0.45, 0.6);
    const tex = loader.load(src);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.1 });
    const card = new THREE.Mesh(geo, mat);
    card.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
    card.lookAt(0, 0, 0);
    card.userData = { angle, radius: 1.5, y: 0 };
    mainGroup.add(card);
    cards.push(card);
});

window.switchModel = function (idx) {
    document.querySelectorAll('.viewer-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    cards.forEach((card, i) => { card.userData.y = i === idx ? 0.6 : 0; });
    const target = cards[idx];
    if (target) {
        const wp = new THREE.Vector3();
        target.getWorldPosition(wp);
        controls.target.lerp(wp, 0.5);
    }
};

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    const t = performance.now() * 0.001;
    particles.rotation.y += 0.0003;
    cards.forEach(card => {
        card.userData.angle += 0.003;
        const a = card.userData.angle;
        const r = card.userData.radius;
        card.position.x = Math.cos(a) * r;
        card.position.z = Math.sin(a) * r;
        card.position.y += (card.userData.y - card.position.y) * 0.05;
        card.lookAt(0, card.position.y, 0);
        card.rotation.z += 0.01;
    });
    knot.rotation.y += 0.005;
    wire.rotation.y += 0.005;
    ring.rotation.z += 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
