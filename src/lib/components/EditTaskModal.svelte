<script>
// @ts-nocheck


  import { editTask } from "$lib/stores/database";
  import { selectedTaskStore, tasksStore } from "$lib/stores/tasksStore";
  import { notificationType } from "$lib/stores/notificationsStore";

  let newTitle = ""; // New title for the task
  let newDescription = ""; // New description for the task

  // Function to handle form submission
  async function handleSubmit() {
    const task = $selectedTaskStore; // Get the selected task from the store
    console.log(task);

    if (!newTitle || newTitle.trim() === "") {
      console.error("New task title cannot be empty.");
      return;
    }

    if (!newDescription || newDescription.trim().length > 60) {
      console.error("New task description must be a maximum if 60 characters.");
      return;
    }

    const taskId = task.id; // Get the document ID of the task
    try {
      // Update the task with the new title and description in the database
      await editTask(taskId, { title: newTitle, description: newDescription });
      console.log("Task updated successfully.");

      // Update tasksStore with the modified task
      tasksStore.update((tasks) => {
        // Find the task in the tasksStore and update its title and description
        const updatedTasks = tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, title: newTitle, description: newDescription };
          }
          return t;
        });

        return updatedTasks;
      });

      notificationType.set(2); // Trigger task changed notif
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="close" on:click={closeModal}>&times;</span>
    </div>
    <div class="modal-body">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>New Title:</label>
      <input
        type="text"
        bind:value={newTitle}
        placeholder={$selectedTaskStore ? $selectedTaskStore.title : ""}
      />
      {#if $selectedTaskStore && (!newTitle || newTitle.trim() === "")}
        <p class="error">Please enter a new title.</p>
      {/if}

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>New Description:</label>
      <textarea
        bind:value={newDescription}
        placeholder={$selectedTaskStore ? $selectedTaskStore.description : ""}
      ></textarea>
      {#if $selectedTaskStore && (!newDescription || newDescription.trim().length > 60)}
        <p class="error">
          Please enter a new description with a maximum of 60 characters.
        </p>
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
    background-color: var(--magic-purple);
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
    color: var(--accent-orange);
    font-size: 14px;
    margin-top: 5px;
  }

  .current-title,
  .current-description {
    margin-top: 15px;
    font-weight: bold;
  }

  .modal-footer button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
