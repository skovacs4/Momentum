<!-- Main.svelte -->
<script>
  import AddTaskModal from "$lib/components/AddTaskModal.svelte";
  import { auth } from "$lib/firebase";
  import Authentication from "$lib/components/Authentication.svelte";
  import Tasks from "$lib/components/Tasks.svelte";
  import Points from "$lib/components/Points.svelte";
  import VirtualCharacter from "$lib/components/VirtualCharacter.svelte";

  /**
   * @type {string | null}
   */
  let email;
  /**
   * @type {import("@firebase/auth").User | null}
   */
  let user = null; // Initialize user as null initially

  // Listen for authentication state changes
  auth.onAuthStateChanged((currentUser) => {
    user = currentUser; // Update user when authentication state changes

    // If user is logged in, set email
    if (user) {
      email = user.email;
    }
  });

  let showModal = false; // State variable to control the visibility of the modal
  /**
   * @type {any}
   */
  let container; 

  function openModal() {
    showModal = true; // Set showModal to true to show the modal
  }

  function closeModal() {
    showModal = false; // Set showModal to false to hide the modal
  }
</script>

{#if user !== null}
  <!-- Check if user is not null -->
  {#if user}
    <!-- If user is logged in -->
    <div>
      <h1>CURRENT USER: {email}</h1>
    </div>
    <VirtualCharacter />
    <Tasks />
    <button on:click={openModal}>Add Task</button>
    <AddTaskModal {showModal} on:closeModal={closeModal} />
    <Points />
  {:else}
    <!-- If user is not logged in -->
    <Authentication />
  {/if}
{/if}
