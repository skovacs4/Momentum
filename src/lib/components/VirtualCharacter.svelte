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
  
	onMount(() => {
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
		  document
			.getElementById("three-container")
			.appendChild(renderer.domElement);
  
		  const geometry = new THREE.BoxGeometry(1, 1, 1);
		  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
  
  <svelte:head>
	<title>SvelteKit + ThreeJS</title>
  </svelte:head>
  
  <div id="three-container" style="width: 400px; height: 400px;"></div>
  