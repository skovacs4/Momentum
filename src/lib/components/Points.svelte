<script>
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { calculateUserPointsAndLevel } from "$lib/stores/database";

  // Define exported variables
  export let completedTasksCount = 0;
  export let totalPoints = 0;
  export let level = 1;
  export let currentLevelPoints = 0;

  const pointsPerLevel = 30; // Define the points required to reach the next level

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userId = user.uid;
        const { totalPoints: generatedPoints, level: calculatedLevel } =
          await calculateUserPointsAndLevel(userId);

        // Update component variables with calculated values
        totalPoints = generatedPoints;
        level = calculatedLevel;

        // Calculate current points within the current level
        currentLevelPoints = totalPoints % pointsPerLevel;
      } catch (error) {
        console.error(
          "Error fetching tasks or calculating points/level:",
          error
        );
      }
    }
  });
</script>

<div class="points-container">
  <h1 class="stats">Stats</h1>
  <!-- Display calculated total points and level -->
  <p>Total Generated Points: {totalPoints}</p>
  <!-- Display current points within the current level -->
  <p>Current Level Points: {currentLevelPoints}</p>
  <!-- Progress bar for level completion -->
  <div class="progress-bar">
    <div
      class="progress"
      style="width: {(currentLevelPoints / pointsPerLevel) * 100}%;"
    ></div>
    <div class="level-text">{level}</div>
  </div>
  <p>Lvl. {level}</p>
</div>

<style lang="scss">

  .points-container {
    margin-top: 20px;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    height: 20px;
    // background-color: var(--magic-purple);
    border-radius: 5px;
    margin-top: 10px;
    overflow: hidden;
    border: 2px solid rgba(241, 238, 238, 0.3);
  }

  .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    // background-color: var(--accent-orange);
    background: linear-gradient(135deg, var(--accent-gold), var(--accent-orange));;
    transition: width 0.3s ease-in-out;
  }

  .level-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--text);
    font-weight: bold;
  }
</style>
