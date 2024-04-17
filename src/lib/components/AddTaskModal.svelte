<script>
  import { createEventDispatcher } from "svelte";
  import { addTask } from "$lib/stores/database";
  import { tasksStore } from "$lib/stores/tasksStore";

  /**
   * @type {any}
   */
  export let showModal;

  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";
  let difficulty = "";
  let completed = false;

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

    if (!description || description.trim().length > 60) {
      descriptionError =
        "Please enter a maximum of 60 characters for the description.";
      return;
    }

    // Capitalize the title
    const capitalizedTitle =
      title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    // Add the task with capitalized title to the database
    addTask(capitalizedTitle, description, difficulty)
      .then((newTask) => {
        console.log("Task added successfully:", capitalizedTitle, description, difficulty, completed);

        // Update tasksStore with the newly added task
        tasksStore.update((tasks) => [
          // @ts-ignore
          ...tasks,
          // @ts-ignore
          { capitalizedTitle, description, difficulty, completed },
        ]);

        closeModal(); // Reset form after task is added
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }
</script>

<div class="modal" style={showModal ? "display: block;" : "display: none;"}>
  <div class="modal-content">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-header">
      <h2>Add New Task</h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          placeholder="Enter task description (maximum 60 characters)"
        ></textarea>
        {#if descriptionError}
          <p class="error">{descriptionError}</p>
        {/if}

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

        <div class="modal-footer">
          <button type="button" on:click={closeModal}>Cancel</button>
          <button type="submit">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</div>

<style lang="scss">
</style>
