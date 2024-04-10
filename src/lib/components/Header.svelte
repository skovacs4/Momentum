<script>
  import { authHandlers, authStore } from "$lib/stores/authStore";
</script>

<header>
  <nav>
    {#if !$authStore.currentUser}
      <a href="/login">Login</a>
    {:else}
      <a href="/">Home</a>
      <a href="/history">History</a>
      <a href="/leaderboard">Leaderboard</a>
      <a href="/" on:click|preventDefault={authHandlers.logout}>Logout</a>
    {/if}
  </nav>
</header>

<style lang="scss">
  header {
    z-index: 10;
    background-color: white;

    nav {
      text-align: center;
      width: 50%;
      border-radius: 26px;
      display: flex;

      a {
        text-decoration: none;
        color: var(--primary-color);
        padding: 25px;
        // border-radius: 10px;
      }

      a:visited {

      }

      a:hover {
        color: var(--accent-orange);
        background-color: aliceblue;
        border-bottom: var(--accent-orange) 1px solid;
      }
    }
  }
</style>
