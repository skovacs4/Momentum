<script>
  import { createEventDispatcher } from "svelte";
  import { addTask } from "$lib/stores/database";

  /**
   * @type {boolean}
   * @prop
   */
  export let showModal; // Define showModal prop

  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";
  let difficulty = "";

  // Function to close the modal
  function closeModal() {
    dispatch("closeModal");
  }

  // Function to handle form submission
  /**
   * @param {{ preventDefault: () => void; }} event
   */
  function handleSubmit(event) {
    event.preventDefault();
    addTask(title, description, difficulty)
      .then(() => {
        console.log("Task added successfully.");
        closeModal();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }
</script>

<div class="modal" style={showModal ? "display: block;" : "display: none;"}>
  <div class="modal-content">
    <!-- Modal header -->
    <div class="modal-header">
      <h2>Add New Task</h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="close" on:click={closeModal}>&times;</span>
    </div>

    <!-- Modal body (form for adding a new task) -->
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

        <label for="taskDescription">Description:</label>
        <input
          type="text"
          id="taskDescription"
          name="taskDescription"
          bind:value={description}
          placeholder="Enter task description"
        />

        <label for="taskDifficulty">Difficulty:</label>
        <select
          id="taskDifficulty"
          name="taskDifficulty"
          bind:value={difficulty}
        >
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>

        <!-- Modal footer (buttons for actions) -->
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
