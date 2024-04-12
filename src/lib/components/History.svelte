<!-- History.svelte -->

<!-- Import statements and component setup -->
<script>
  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";

  /**
     * @type {any[]}
     */
  let tasks = [];
  export let completedTasksCount = 0;

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        tasks = await fetchTasksForUser();
        // @ts-ignore
        completedTasksCount = countCompletedTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  /**
     * @param {{ filter: (arg0: (task: any) => any) => { (): any; new (): any; length: any; }; }} tasks
     */
  function countCompletedTasks(tasks) {
    return tasks.filter((/** @type {{ completed: any; }} */ task) => task.completed).length;
  }

  /**
   * Format a date string into a human-readable format
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date in 'YYYY-MM-DD' format
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  }
</script>

<!-- Component template -->
<div class="tasks-container">
  <h1>History</h1>
  <table class="tasks-table">
    <thead>
      <tr>
        <th>Task</th>
        <th>Status</th>
        <th>Created At</th> <!-- Add a new column for Created At -->
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr class:completed={task.completed}>
          <td>{task.title}</td>
          <td>{task.completed ? 'Completed' : 'Pending'}</td>
          <td>{formatDate(task.createdAt)}</td> <!-- Display the createdAt date -->
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Component styles -->
<style lang="scss">
  .tasks-container {
    margin-top: 20px;
    padding: 20px;
  }

  .tasks-table {
    width: 100%;
    border-collapse: collapse;
  }

  .tasks-table th,
  .tasks-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .tasks-table th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
  }

  .completed {
    background-color: #d4edda; /* Light green for completed tasks */
    color: #155724;
  }
</style>
