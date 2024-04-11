<script>
  import { createEventDispatcher } from "svelte";
  import { addTask } from "$lib/stores/database";

  /**
     * @type {any}
     */
   export let showModal;

  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";
  let difficulty = "";

  let titleError = "";
  let descriptionError = "";

  function closeModal() {
    dispatch("closeModal");
    // Reset form fields and validation errors
    title = "";
    description = "";
    difficulty = "";
    titleError = "";
    descriptionError = "";
  }

  /**
     * @param {{ preventDefault: () => void; }} event
     */
  function handleSubmit(event) {
    event.preventDefault();

    // Reset previous validation errors
    titleError = "";
    descriptionError = "";

    // Validate form fields
    if (!title || title.trim() === "") {
      titleError = "Please enter a task title.";
      return;
    }

    if (!description || description.trim().length < 30) {
      descriptionError = "Please enter a description with at least 30 characters.";
      return;
    }

    // Capitalize the title
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    // If form is valid, add the task with capitalized title
    addTask(capitalizedTitle, description, difficulty)
      .then(() => {
        console.log("Task added successfully.");
        closeModal(); // Reset form after task is added
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }
</script>

<div class="modal" style={showModal ? "display: block;" : "display: none;"}>
  <div class="modal-content">
    <div class="modal-header">
      <h2>Add New Task</h2>
      <span class="close" on:click={closeModal}>&times;</span>
    </div>

    <div class="modal-body">
      <form on:submit={handleSubmit}>
        <label for="taskTitle">Task Title:</label>
        <input
          type="text"
          id="taskTitle"
          name="taskTitle"
          bind:value={title}
          placeholder="Enter task title"
        />
        {#if titleError}
          <p class="error">{titleError}</p>
        {/if}

        <label for="taskDescription">Description:</label>
        <textarea
          id="taskDescription"
          name="taskDescription"
          bind:value={description}
          placeholder="Enter task description (minimum 30 characters)"
        ></textarea>
        {#if descriptionError}
          <p class="error">{descriptionError}</p>
        {/if}

        <label for="taskDifficulty">Difficulty:</label>
        <select id="taskDifficulty" name="taskDifficulty" bind:value={difficulty}>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>

        <div class="modal-footer">
          <button type="button" on:click={closeModal}>Cancel</button>
          <button type="submit">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
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
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
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

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .error {
    color: red;
    margin-top: 5px;
    font-size: 14px;
  }

  .modal-footer button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
