<script>
  import Leaderboard from "$lib/components/Leaderboard.svelte";
  import { auth } from "$lib/firebase";
  import Authentication from "$lib/components/Authentication.svelte";

    /**
   * @type {string | null}
   */
   let email;
  /**
   * @type {import("@firebase/auth").User | null}
   */
  let user = null;

  auth.onAuthStateChanged((currentUser) => {
    user = currentUser;
    if (user) {
      email = user.email;
    }
  });
</script>

{#if user !== null}
  {#if user}
    <Leaderboard />
  {:else}
    <Authentication />
  {/if}
{/if}
