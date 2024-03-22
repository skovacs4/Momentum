<!-- layout.svelte -->
<script>
	import { onMount } from "svelte";
	import { auth } from "$lib/firebase";
	import { browser } from "$app/environment";
	import { authHandlers, authStore } from "$lib/stores/authStore";
	import { goto } from '$app/navigation';
	import Footer from "$lib/components/Footer.svelte";
  
	onMount(() => {
	  const unsubscribe = auth.onAuthStateChanged((user) => {
		console.log(user);
		// Update the authentication state in the store
		// @ts-ignore
		authStore.update((curr) => {
		  return { ...curr, isLoading: false, currentUser: user };
		});
  
		if (!user && browser && window.location.pathname !== "/login") {
		  // If user is not logged in and the current page is not the login page, redirect to login
		  goto('/login');
		}
	  });
	  return unsubscribe;
	});
  </script>
  
  <nav>
	{#if !$authStore.currentUser}
	  <a href="/register">Register</a>
	  <a href="/login">Login</a>
	{:else}
	  <a href="/" on:click|preventDefault={authHandlers.logout}>Logout</a>
	{/if}
	<a href="/history">History</a>
  </nav>
  
  <main class="mainContainer">
	<slot />
  </main>

  <Footer />
  
  <style>
	.mainContainer {
	  min-height: 100vh;
	  display: flex;
	  flex-direction: column;
	}
  </style>
  