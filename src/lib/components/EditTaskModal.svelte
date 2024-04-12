<script>
  // @ts-nocheck

  import { editTask } from "$lib/stores/database";
  import { selectedTaskStore } from "$lib/stores/tasksStore"; // Import the selectedTaskStore

  let newTitle = ""; // New title for the task
  let newDescription = ""; // New description for the task

  // Function to handle form submission
  async function handleSubmit() {
    const task = $selectedTaskStore; // Get the selected task from the store

    if (!newTitle || newTitle.trim() === "") {
      console.error("New task title cannot be empty.");
      return;
    }

    if (!newDescription || newDescription.trim().length < 30) {
      console.error("New task description must be at least 30 characters.");
      return;
    }

    const taskId = task.id; // Get the document ID of the task

    try {
      // Update the task with the new title and description
      await editTask(taskId, { title: newTitle, description: newDescription });
      console.log("Task updated successfully.");
      selectedTaskStore.set(null); // Reset the selected task
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // Function to close the modal and clear form fields
  function closeModal() {
    selectedTaskStore.set(null); // Reset the selected task
    newTitle = ""; // Clear the newTitle field
    newDescription = ""; // Clear the newDescription field
  }
</script>

<div class="modal" style={`display: ${$selectedTaskStore ? "block" : "none"};`}>
  <div class="modal-content">
    <div class="modal-header">
      <h2>Edit Task</h2>
      <span class="close" on:click={closeModal}>&times;</span>
    </div>
    <div class="modal-body">
      <label>New Title:</label>
      <input type="text" bind:value={newTitle} />
      {#if $selectedTaskStore && (!newTitle || newTitle.trim() === "")}
        <p class="error">Please enter a new title.</p>
      {/if}

      <label>New Description:</label>
      <textarea bind:value={newDescription}></textarea>
      {#if $selectedTaskStore && (!newDescription || newDescription.trim().length < 30)}
        <p class="error">Please enter a new description with at least 30 characters.</p>
      {/if}

      <div class="current-title">
        Current Title: {$selectedTaskStore ? $selectedTaskStore.title : ""}
      </div>
    </div>
    <div class="modal-footer">
      <button on:click={handleSubmit}>Save</button>
      <button on:click={closeModal}>Cancel</button>
    </div>
  </div>
</div>

<style lang="scss">
  /* Modal styles */
  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    padding-top: 60px;
    border-radius: 12px;
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 400px; /* Adjust max-width as needed */
  }

  .modal-header,
  .modal-footer {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    text-align: center;
    
    h2 {
      text-align: left;
    }
  }

  .modal-body {
    padding: 20px 0;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .error {
    color: rgb(221, 57, 57);
    font-size: 14px;
    margin-top: 5px;
  }

  .current-title {
    margin-top: 15px;
    font-weight: bold;
  }

  .modal-footer button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
