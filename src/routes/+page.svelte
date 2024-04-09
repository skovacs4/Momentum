<!-- Main.svelte -->
<script>
  import AddTaskModal from "$lib/components/AddTaskModal.svelte";
  import { auth } from "$lib/firebase";
  import Authentication from "$lib/components/Authentication.svelte";
  import Tasks from "$lib/components/Tasks.svelte";
  import Points from "$lib/components/Points.svelte";
  import VirtualCharacter from "$lib/components/VirtualCharacter.svelte";
  import Leaderboard from '$lib/components/Leaderboard.svelte';

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

  let showModal = false;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

{#if user !== null}
  {#if user}
    <div>
      <h1>CURRENT USER: {email}</h1>
    </div>
    <VirtualCharacter />
    <Tasks />
    <button on:click={openModal}>Add Task</button>
    <AddTaskModal {showModal} on:closeModal={closeModal} />
    <Points />
    <Leaderboard />
  {:else}
    <Authentication />
  {/if}
{/if}

<style lang="scss">
  /* Global Styles */
  :global(body) {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
    color: #333;
  }

  /* Container Styles */
  div {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  /* Heading Styles */
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #007bff;
  }

  /* Button Styles */
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Modal Styles */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* Points Styles */
  .points-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
  }
</style>
