<!-- TasksList.svelte -->
<script>
  // @ts-nocheck

  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import EditTaskModal from "$lib/components/EditTaskModal.svelte";
  import CompleteButton from "$lib/components/CompleteButton.svelte";
  import {
    selectedTaskStore,
    selectedTaskStoreSecond,
  } from "$lib/stores/tasksStore"; // Import the selectedTaskStore
  import { onMount } from "svelte";

  /**
   * @type {any[]}
   */
  let tasks = [];

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      // Fetch tasks for the logged-in user
      try {
        tasks = await fetchTasksForUser();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  // Function to open the edit task modal
  function openEditModal(task) {
    selectedTaskStore.set(task);
  }

  // Function to open the complete task modal
  function openCompleteModal(task) {
    selectedTaskStoreSecond.set(task);
  }
</script>

<div class="tasks-container">
  <!-- Render the tasks data -->
  {#each tasks.filter((task) => !task.completed) as task}
    <div class="task">
      <span>{task.title}</span>
      <button on:click={() => openEditModal(task)}>Edit</button>
      <button on:click={() => openCompleteModal(task)}>Complete</button>
    </div>
  {/each}
  <EditTaskModal {selectedTaskStore} />
  <CompleteButton {selectedTaskStoreSecond} />
</div>


<style lang="scss">

</style>