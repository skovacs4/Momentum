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
      <div class="shrink-0 bg-gray-100 h-50px w-50px"></div>
      <span>{task.title}</span>
      <button on:click={() => openEditModal(task)}>Edit</button>
      <button on:click={() => openCompleteModal(task)}>Complete</button>
    </div>
  {/each}
  <EditTaskModal {selectedTaskStore} />
  <CompleteButton {selectedTaskStoreSecond} />
</div>


<style lang="scss">
/* Global Reset and Container Styles */
:global(body) {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #333;
  }

  .tasks-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: grid;
    gap: 20px;
  }

  /* Task Styles */
  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .task span {
    font-size: 16px;
    flex: 1;
  }

  .task button {
    padding: 8px 16px;
    margin-left: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .task button:hover {
    background-color: #007bff;
    color: #fff;
  }

  /* EditTaskModal Styles */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }

  /* CompleteButton Styles */
  .complete-button {
    padding: 8px 16px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .complete-button:hover {
    background-color: #218838;
  }
</style>