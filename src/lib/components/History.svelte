<!-- History.svelte -->
<script>
  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";

  /**
   * @type {any[]}
   */
  let tasks = [];
  export let completedTasksCount = 0; // Export the completedTasksCount variable

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      // Fetch tasks for the logged-in user
      try {
        tasks = await fetchTasksForUser();
        completedTasksCount = countCompletedTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  // Function to count completed tasks
  /**
   * @param {any[]} tasks
   */
  function countCompletedTasks(tasks) {
    return tasks.filter((task) => task.completed).length;
  }
</script>

<div class="tasks-container">
  <!-- Render the tasks data -->
  {#each tasks.filter((task) => task.completed) as task}
    <div class="task">
      <span>{task.title}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  // styles
</style>