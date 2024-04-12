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
  <a href="/" class="logo-header-container"
    ><img src="assets/wonder-5-alt.png" alt="logo" class="logo-header" /></a
  >
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
        line-height: 32px;
        position: relative;
        font-weight: 500;
      }

      a:visited {
        color: var(--primary-color);
      }

      a::after {
        content: "";
        position: absolute;
        bottom: 1px; /* Position the line vertically at the middle of the link */
        left: 50%; /* Position the line horizontally at the middle of the link */
        transform: translate(-50%, 50%); /* Center the line precisely */
        width: 0;
        height: 2px;
        background-color: var(--accent-orange);
        transition: width 0.3s ease; /* Transition width for animation */
      }

      a:hover::after {
        width: calc(
          100% - 50px
        ); /* Expand the line to 100% width minus some padding */
      }

      a:hover {
        color: var(--accent-orange);
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
