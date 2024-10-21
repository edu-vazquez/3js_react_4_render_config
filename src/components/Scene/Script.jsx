import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';


//Global variables
let currentRef = null;


let gui = new dat.GUI({width: 400})

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

const envMap = new THREE.CubeTextureLoader().load([
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './ny.png',
]);
scene.environment = envMap;



// Instantiate a loader
const loader = new GLTFLoader();
// Load a glTF resource
loader.load(
	// resource URL
	'./scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {
	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);
//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//lights
const lightsFolder = gui.addFolder("LIGHTS");
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const light = new THREE.PointLight( 0xffffff, 20, 1 );
light.position.set(0, 2, 2);
scene.add( light );

const light1 = new THREE.DirectionalLight(0xff0000,1);
light1.position.set(3,3,3);
scene.add(light1);
lightsFolder.add(light1, 'intensity')
	.min(0).max(100)
	.step(0.1)
	.name('intensity');



//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
	gui.destroy();
	currentRef.removeChild(renderer.domElement);
};
