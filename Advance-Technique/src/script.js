import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'lil-gui';
import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';


const BASE_URL = "/cs544-paper"
const debugObject = {};
const gui = new dat.GUI({ width: 400 });
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader().setDecoderPath(`${BASE_URL}/draco/`);
const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader);

const bakedTexture = textureLoader.load(`${BASE_URL}/baked.jpg`);
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

debugObject.portalColorStart = '#ff0000';
debugObject.portalColorEnd = '#0000ff';

gui.addColor(debugObject, 'portalColorStart').onChange(() => {
    portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart);
});

gui.addColor(debugObject, 'portalColorEnd').onChange(() => {
    portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
});

const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) }
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
});

gltfLoader.load(`${BASE_URL}/portal.glb`, (gltf) => {
    scene.add(gltf.scene);
    const [bakedMesh, portalLightMesh, poleLightAMesh, poleLightBMesh] = [
        'baked', 'portalLight', 'poleLightA', 'poleLightB'
    ].map(name => gltf.scene.children.find(child => child.name === name));

    Object.assign(bakedMesh, { material: bakedMaterial });
    Object.assign(portalLightMesh, { material: portalLightMaterial });
    Object.assign(poleLightAMesh, { material: poleLightMaterial });
    Object.assign(poleLightBMesh, { material: poleLightMaterial });
});

const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
    positionArray.set([(Math.random() - 0.5) * 4, Math.random() * 1.5, (Math.random() - 0.5) * 4], i * 3);
    scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

const firefliesMaterial = new THREE.ShaderMaterial({
uniforms: {
uTime: { value: 0 },
uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
uSize: { value: 100 }
},
vertexShader: firefliesVertexShader,
fragmentShader: firefliesFragmentShader,
transparent: true,
blending: THREE.AdditiveBlending,
depthWrite: false
});

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize');

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
Object.assign(sizes, { width: window.innerWidth, height: window.innerHeight });
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 2, 4);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = '#201919';
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, 'clearColor').onChange(() => {
renderer.setClearColor(debugObject.clearColor);
});

const clock = new THREE.Clock();

const tick = () => {
const elapsedTime = clock.getElapsedTime();
portalLightMaterial.uniforms.uTime.value = elapsedTime;
firefliesMaterial.uniforms.uTime.value = elapsedTime;

controls.update();

renderer.render(scene, camera);
window.requestAnimationFrame(tick);
};

tick();
