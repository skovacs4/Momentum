<script>
  // @ts-nocheck

  import { editTask } from "$lib/stores/database";
  import { selectedTaskStore } from "$lib/stores/tasksStore"; // Import the selectedTaskStore

  /**
   * @typedef {import('svelte/store').Writable} Writable
   */

  let newTitle = ""; // New title for the task

  // Function to handle form submission
  async function handleSubmit() {
    const task = $selectedTaskStore; // Get the selected task from the store
    // console.log("Selected Task:", task); // Log the selected task

    const taskId = task.id; // Get the document ID of the task
    // console.log("Selected Task ID:", taskId);

    try {
      // Update the task with the new title
      await editTask(taskId, { title: newTitle });
      console.log("Task updated successfully.");
      selectedTaskStore.set(null); // Reset the selected task
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // Function to close the modal
  function closeModal() {
    selectedTaskStore.set(null); // Reset the selected task
  }
</script>

<div class="modal" style={`display: ${$selectedTaskStore ? "block" : "none"};`}>
  <div class="modal-content">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-header">
      <h2>Edit Task</h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span class="close" on:click={closeModal}>&times;</span>
    </div>
    <div class="modal-body">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        Current Title: {$selectedTaskStore ? $selectedTaskStore.title : ""}
        <!-- Display current title if task is defined -->
      </label>
      <label>
        New Title:
        <input type="text" bind:value={newTitle} />
      </label>
    </div>
    <div class="modal-footer">
      <button on:click={handleSubmit}>Save</button>
      <button on:click={closeModal}>Cancel</button>
    </div>
  </div>
</div>

<style>
  /* Modal styles */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    padding-top: 60px; /* Location of the box */
  }

  /* Show modal if selectedTaskStore has a value */
  .modal.show {
    display: block;
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .modal-header,
  .modal-footer {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

  .modal-body {
    padding: 20px 0;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
