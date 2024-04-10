<script>
	// @ts-nocheck
  
	/**
	 * @typedef {import('three').PerspectiveCamera} PerspectiveCamera
	 * @typedef {import('three').Scene} Scene
	 * @typedef {import('three').WebGLRenderer} WebGLRenderer
	 * @typedef {import('three').BoxGeometry} BoxGeometry
	 * @typedef {import('three').MeshBasicMaterial} MeshBasicMaterial
	 * @typedef {import('three').Mesh} Mesh
	 */
  
	import { browser } from "$app/environment";
	import * as THREE from "three";
	import { onMount } from "svelte";
	import { auth } from "$lib/firebase";
	import SelectCharacter from "$lib/components/SelectCharacter.svelte";
  
	const user = auth.currentUser;
	var character = null;
	var characterData = null;

	var startCharacter = "characters/bull-pixel.png";
  
	onMount(async () => {
	  if (user) {
		// Fetch character for the logged-in user
		try {
		  characterData = await fetchCharacter();
		} catch (error) {
		  console.error("Error fetching character:", error);
		}
	  }
  
	  character = characterData[0].name;
	  console.log(character);
  
	  if (browser) {
		/** @type {PerspectiveCamera} */
		let camera;
		/** @type {Scene} */
		let scene;
		/** @type {WebGLRenderer} */
		let renderer;
		/** @type {Mesh<BoxGeometry, MeshBasicMaterial>} */
		let cube;
  
		/**
		 * Initializes the scene, camera, renderer, and cube mesh.
		 */
		const init = () => {
		  scene = new THREE.Scene();
		  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  
		  renderer = new THREE.WebGLRenderer();
		  renderer.setSize(400, 400);
		  renderer.setClearColor(0xffffff); // Set renderer background to white
		  document.getElementById("three-container").appendChild(renderer.domElement);
  
		  const geometry = new THREE.BoxGeometry(1, 1, 1);
		  const material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black cube
		  cube = new THREE.Mesh(geometry, material);
		  scene.add(cube);
  
		  camera.position.z = 5;
		};
  
		/**
		 * Renders the scene using the renderer and camera.
		 */
		const render = () => {
		  renderer.clear();
		  renderer.render(scene, camera);
		};
  
		/**
		 * Animates the cube rotation.
		 */
		const animate = () => {
		  requestAnimationFrame(animate);
  
		  cube.rotation.x += 0.005;
		  cube.rotation.y += 0.005;
  
		  render();
		};
  
		init();
		animate();
	  }
	});
  </script>
  
  <!-- <div id="three-container" style="width: 400px; height: 400px;"></div> -->
  <!-- <div class="sketchfab-embed-wrapper">
	<iframe
	  title="Cyberpunk character"
	  frameborder="0"
	  allowfullscreen
	  mozallowfullscreen="true"
	  webkitallowfullscreen="true"
	  allow="autoplay; fullscreen; xr-spatial-tracking"
	  xr-spatial-tracking
	  execution-while-out-of-viewport
	  execution-while-not-rendered
	  web-share
	  src="https://sketchfab.com/models/019f4b3fd3c74ed0bc6c8dbe9cd50d51/embed?autostart=1&preload=1"
	></iframe>
  </div> -->
  <div>
	<img src={startCharacter} alt="Character">
  </div>
  <SelectCharacter />
  
  <style lang="scss">
	#three-container {
	  background-color: white; /* Set background color of the container */
	  display: inline-block; /* Ensure block element behaves correctly */
	  margin: 20px; /* Add space around the container */
	}
  
	.sketchfab-embed-wrapper {
	  p {
		display: none;
	  }
  
	  .controls {
		display: none !important;
	  }
	}
  </style>
  