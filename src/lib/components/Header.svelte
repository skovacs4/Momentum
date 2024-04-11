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
  <a href="/" class="logo-header-container"><img src="assets/wonder-5-alt.png" alt="logo" class="logo-header"></a>
</header>

<style lang="scss">
  header {
    z-index: 10;
    background-color: white;
    display: flex;
    justify-content: space-between;

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
        border-bottom: var(--accent-orange) 1px solid;
      }
    }

    .logo-header {
      width: 75px;
    }

    .logo-header-container {
      padding-right: 2.5%;
    }
  }
</style>
