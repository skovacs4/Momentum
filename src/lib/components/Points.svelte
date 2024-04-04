<!-- Points.svelte -->
<script>
    import { fetchTasksForUser } from "$lib/stores/database";
    import { auth } from "$lib/firebase";
    import { onMount } from "svelte";
  
    /**
     * @type {any[]}
     */
    let tasks = [];
    export let completedTasksCount = 0;
    let totalPoints = 0;
    let totalGeneratedPoints = 0; // Keeps count of total points generated
    let level = 1;
  
    onMount(async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch tasks for the logged-in user
        try {
          tasks = await fetchTasksForUser();
          completedTasksCount = countCompletedTasks(tasks);
          totalGeneratedPoints = calculateTotalPoints(completedTasksCount);
          totalPoints = totalGeneratedPoints;
          level = calculateLevel(totalGeneratedPoints);
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
  
    // Function to calculate total points based on the number of tasks
    /**
     * @param {number} tasksCount
     */
    function calculateTotalPoints(tasksCount) {
      return tasksCount * 3; // Each task is counted as 3 points
    }
  
    // Function to calculate level based on total points
    /**
     * @param {number} points
     */
    function calculateLevel(points) {
      // Define the number of points required to reach each level
      const pointsPerLevel = 30;
      return Math.floor(points / pointsPerLevel) + 1; // Start from level 1
    }
  </script>
  
  <div class="points-container">
    <!-- Calculate and display total points and level -->
    <p>Level: {level}</p>
    <!-- <p>Total Points: {totalPoints}</p> -->
    <p>Total Generated Points: {totalGeneratedPoints}</p>

  </div>
  
  <style>
    .points-container {
      margin-top: 20px;
    }
  </style>
  