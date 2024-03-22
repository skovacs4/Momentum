<script>
	import { authHandlers, authStore } from "$lib/stores/authStore";
  
  </script>
  
  <header>
    <nav>
        {#if !$authStore.currentUser}
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        {:else}
          <a href="/" on:click|preventDefault={authHandlers.logout}>Logout</a>
        {/if}
        <a href="/history">History</a>
      </nav>
  </header>
