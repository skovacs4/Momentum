<!-- TasksList.svelte -->
<script>
  // @ts-nocheck
  import { Icon } from "svelte-icons-pack";
  import { CiEdit } from "svelte-icons-pack/ci";
  import { IoCheckmarkCircleOutline } from "svelte-icons-pack/io";
  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import EditTaskModal from "$lib/components/EditTaskModal.svelte";
  import CompleteButton from "$lib/components/CompleteButton.svelte";
  import {
    selectedTaskStore,
    selectedTaskStoreSecond,
    tasksStore,
  } from "$lib/stores/tasksStore"; // Import the selectedTaskStore
  import { onMount } from "svelte";

  /**
   * @type {any[]}
   */
  let tasks = [];

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Fetch tasks for the logged-in user
        tasks = await fetchTasksForUser();
        tasksStore.set(tasks); // Update tasksStore with fetched tasks
        console.log("Reactive tasks:", $tasksStore); // Log tasksStore for debugging
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  // Listen for changes in selectedTaskStoreSecond
  // $: {
  //   const completedTask = $selectedTaskStoreSecond;
  //   if (completedTask) {
  //     // Remove the completed task from the tasks list
  //     tasks = tasks.filter((task) => task.id !== completedTask.id);
  //   }
  // }

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
  {#each $tasksStore.filter((task) => !task.completed) as task}
    <div class="task">
      <div class="task-details">
        <p class="title">{task.title}</p>
        <p class="description">{task.description}</p>
      </div>
      <div class="task-buttons">
        <button on:click={() => openEditModal(task)} class="edit"
          ><Icon src={CiEdit} className="edit-icon" /></button
        >
        <!-- svelte-ignore missing-declaration -->
        <button on:click={() => openCompleteModal(task)} class="complete"
          ><Icon
            src={IoCheckmarkCircleOutline}
            className="complete-icon"
          /></button
        >
      </div>
    </div>
  {/each}
  <EditTaskModal {selectedTaskStore} />
  <CompleteButton {selectedTaskStoreSecond} />
</div>
