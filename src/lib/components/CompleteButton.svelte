<script>
  import { selectedTaskStoreSecond } from "$lib/stores/tasksStore";
  import { editTask } from "$lib/stores/database";
  import { createEventDispatcher } from "svelte";

  const dispatcher = createEventDispatcher();

  // Function to mark the task as completed
  async function completeTask() {
    const task = $selectedTaskStoreSecond; // Get the selected task from the store

    try {
      // Set task to completed in the database
      // @ts-ignore
      await editTask(task.id, { completed: true });
      console.log("Task marked as complete!");
    } catch (error) {
      console.error("Error editing the task:", error);
    } finally {
      // Reset the selected task in the store
      selectedTaskStoreSecond.set(null);
    }
  }

  // Function to cancel and close the modal
  function closeModal() {
    selectedTaskStoreSecond.set(null); // Reset the selected task
  }
</script>

<div class="modal" style={`display: ${$selectedTaskStoreSecond ? "block" : "none"};`}>
  <div class="modal-content">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-header">
      <h2>Set task as completed?</h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span class="close" on:click={closeModal}>&times;</span>
    </div>
    <div class="modal-footer">
      <button on:click={completeTask}>Continue</button>
      <button on:click={closeModal}>Cancel</button>
    </div>
  </div>
</div>

<style lang="scss">
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

  /* Show modal if selectedTaskStoreSecond has a value */
  .modal.show {
    display: block;
  }

  .modal-content {
    background-color: var(--magic-purple);
    margin: auto;
    padding: 20px;
    border: 1px solid #333;
  }

  .modal-header,
  .modal-footer {
    padding: 10px 0;
    text-align: center;

    h2 {
      text-align: center;
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
  }

  .modal-footer {
    display: flex;
    justify-content: center;

    button {
      margin: 0 10px;
    }
  }
</style>
