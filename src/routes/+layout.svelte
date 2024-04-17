<!-- layout.svelte -->
<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import { browser } from "$app/environment";
  import { authHandlers, authStore } from "$lib/stores/authStore";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import Notification from '$lib/components/Notification.svelte';

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Update the authentication state in the store
      // @ts-ignore
      authStore.update((curr) => {
        return { ...curr, isLoading: false, currentUser: user };
      });

      if (!user && browser && window.location.pathname !== "/login") {
        // If user is not logged in and the current page is not the login page, redirect to login
        goto("/login");
      }
    });
    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Momentum</title>
</svelte:head>

<Header />
<main class="mainContainer">
  <slot />
  <Notification />
</main>
<Footer />

<style lang="scss">
  .mainContainer {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

</style>
