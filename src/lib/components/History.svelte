<!-- History.svelte -->
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
</script>

<div class="tasks-container">
  <h1> History </h1>
  <table class="tasks-table">
    <thead>
      <tr>
        <th>Task</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr class:completed={task.completed}>
          <td>{task.title}</td>
          <td>{task.completed ? 'Completed' : 'Pending'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .tasks-container {
    margin-top: 20px;
    padding: 75px;
  }

  .tasks-table {
    width: 100%;
    border-collapse: collapse;
  }

  .tasks-table th, .tasks-table td {
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
