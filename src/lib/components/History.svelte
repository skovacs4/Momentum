<!-- History.svelte -->

<!-- Import statements and component setup -->
<script>
  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { tasksStore } from '$lib/stores/tasksStore'; 

  /** @type {any[]} */
  let tasks; // No need to initialize here 
  export let completedTasksCount = 0; 

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const fetchedTasks = await fetchTasksForUser();
        tasksStore.set(fetchedTasks); // Update the store
        completedTasksCount = countCompletedTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  // Subscribe to the taskStore
  // @ts-ignore
  tasksStore.subscribe((/** @type {any[]} */ value) => {
    tasks = value;
    // @ts-ignore
    completedTasksCount = countCompletedTasks(tasks);
  });

  /**
     * @param {{ filter: (arg0: (task: any) => any) => { (): any; new (): any; length: any; }; }} tasks
     */
  function countCompletedTasks(tasks) {
    return tasks.filter((/** @type {{ completed: any; }} */ task) => task.completed).length;
  }

  /**
     * @param {string | number | Date} dateString
     */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UK', { year: 'numeric', month: 'short', day: '2-digit' });
  }
</script>

<div class="tasks-container">
  <h1>History</h1>
  <table class="tasks-table">
    <thead>
      <tr>
        <th>Task</th>
        <th>Description</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr class="completed:{task.completed}">
          <td>{task.title}</td>
          <td>{task.description}</td>
          <td>{task.completed ? 'Completed' : 'Pending'}</td>
          <td>{formatDate(task.createdAt)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Component styles written in SASS -->
<style lang="scss">
  $primary-color: white;
  $secondary-color: var(--secondary-color);

  .tasks-container {
    margin-top: 20px;
    padding: 20px;

    h1 {
      color: $primary-color;
    }

    .tasks-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(#ddd, 0.5);
        color: $primary-color;
      }

      tbody {
        background-color: var(--primary-color);
      }

      th {
        background-color: var(--magic-purple);
        color: #ddd;
        font-weight: bold;
      }

      .completed {
        background-color: $secondary-color; 
        color: $primary-color; 
        font-style: italic;

        td:nth-child(2) {
          font-weight: bold;
        }
      }
    }
  }
</style>
