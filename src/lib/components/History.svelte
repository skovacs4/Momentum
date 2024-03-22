<!-- TasksList.svelte -->
<script>
    // @ts-nocheck
    import { fetchTasksForUser } from "$lib/stores/database";
    import { auth } from "$lib/firebase";
    import { onMount } from "svelte";
  
    /**
     * @type {any[]}
     */
    let tasks = [];
  
    onMount(async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch tasks for the logged-in user
        try {
          tasks = await fetchTasksForUser();
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    });
  
  </script>
  
  <div class="tasks-container">
    <!-- Render the tasks data -->
    {#each tasks.filter((task) => task.completed) as task}
      <div class="task">
        <span>{task.title}</span>
      </div>
    {/each}
  </div>
  