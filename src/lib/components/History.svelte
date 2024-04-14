<!-- History.svelte -->

<!-- Import statements and component setup -->
<script>
  // @ts-nocheck

  import { fetchTasksForUser } from "$lib/stores/database";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { tasksStore } from "$lib/stores/tasksStore";
  import { SiTicktick } from "svelte-icons-pack/si";
  import { FaClock } from "svelte-icons-pack/fa";
  import { Icon } from "svelte-icons-pack";

  /**
   * @type {never[]}
   */
  let tasks;
  export let completedTasksCount = 0;

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const fetchedTasks = await fetchTasksForUser();
        tasksStore.set(fetchedTasks);
        completedTasksCount = countCompletedTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  });

  tasksStore.subscribe((value) => {
    tasks = value;
    completedTasksCount = countCompletedTasks(tasks);
  });

  /**
   * @param {never[]} tasks
   */
  function countCompletedTasks(tasks) {
    return tasks.filter(
      (/** @type {{ completed: any; }} */ task) => task.completed
    ).length;
  }

  /**
   * @param {string | number | Date} dateString
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  /**
   * @type {{ title: any; description: any; completed: any; createdAt: any; } | null}
   */
  let selectedTask = null;

  /**
   * @param {any} task
   */
  function handleTaskClick(task) {
    if (isMobileDevice()) {
      selectedTask = task;
    }
  }

  function isMobileDevice() {
    return window.innerWidth <= 768; // Adjust breakpoint as needed
  }
</script>

<div class="tasks-container">
  <h1>History</h1>
  <table class="tasks-table">
    <thead>
      <tr>
        <th>Task</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr
          class:completed={task.completed}
          on:click={() => handleTaskClick(task)}
        >
          <td>{task.title}</td>
          <td>
            {#if task.completed}
              <Icon src={SiTicktick} className="icon" />
            {:else}
              <Icon src={FaClock} className="icon" />
            {/if}
          </td></tr
        >
      {/each}
    </tbody>
  </table>
</div>

<!-- Modal for displaying task details -->
{#if selectedTask}
  <div class="modal">
    <div class="modal-content">
      <h2>{selectedTask.title}</h2>
      <p><strong>Description:</strong> {selectedTask.description}</p>
      <p>
        <strong>Status:</strong>
        {selectedTask.completed ? "Completed" : "Pending"}
      </p>
      <p><strong>Created:</strong> {formatDate(selectedTask.createdAt)}</p>
      <button on:click={() => (selectedTask = null)}>Close</button>
    </div>
  </div>
{/if}

<!-- Component styles written in SASS -->
<style lang="scss">
  $primary-color: var(--text);
  $secondary-color: var(--magic-purple);

  .icon {
    font-size: 23px !important;
  }

  @media screen and (max-width: 768px) {
    .tasks-container {
      h1 {
        font-size: 21px;
      }

      .tasks-table {
        font-size: 14px;
      }
    }
  }

  .tasks-container {
    margin-top: 20px;
    padding: 20px;

    h1 {
      color: $primary-color;
    }

    .tasks-table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(#ddd, 0.5);
        color: $primary-color;
        cursor: pointer;

      }

      td:last-child {
        font-size: 18px;
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

  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    text-align: left;
  }

  .modal-content h2 {
    color: $primary-color;
    margin-bottom: 10px;
  }

  .modal-content p {
    margin-bottom: 8px;
  }

  .modal-content button {
    padding: 8px 16px;
    background-color: $secondary-color;
    color: $primary-color;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
</style>
