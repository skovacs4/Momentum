<!-- Main.svelte -->
<script>
  import AddTaskModal from "$lib/components/AddTaskModal.svelte";
  import { auth } from "$lib/firebase";
  import Authentication from "$lib/components/Authentication.svelte";
  import Tasks from "$lib/components/Tasks.svelte";
  import Points from "$lib/components/Points.svelte";
  import Character from "$lib/components/Character.svelte";
  import { RiSystemAddLargeFill } from "svelte-icons-pack/ri";
  import { Icon } from "svelte-icons-pack";

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

<div class="dashboard">
  {#if user !== null}
    {#if user}
      <div class="character-container">
        <Points />
        <Character />
      </div>
      <Tasks />
      <button class="add-task-btn" on:click={openModal}><Icon src={RiSystemAddLargeFill} className="add-task-icon"/></button>
      <AddTaskModal {showModal} on:closeModal={closeModal} />
    {:else}
      <Authentication />
    {/if}
  {/if}
</div>
