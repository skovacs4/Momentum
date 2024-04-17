<script>
  // @ts-nocheck

  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { userStatsStore } from "$lib/stores/tasksStore";
  import { calculateUserPointsAndLevel } from "$lib/stores/database";
  import { notificationType } from "$lib/stores/notificationsStore";

  let userStats = {
    totalPoints: 0,
    level: 1,
    currentLevelPoints: 0,
    pointsPerLevel: 30,
  };

  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userId = user.uid;
        const { totalPoints, level } =
          await calculateUserPointsAndLevel(userId);

        userStatsStore.set({ totalPoints, level, pointsPerLevel: 30 });
      } catch (error) {
        console.error(
          "Error fetching tasks or calculating points/level:",
          error
        );
      }
    }

    // Subscribe to userStatsStore and update userStats accordingly
    const unsubscribe = userStatsStore.subscribe((stats) => {
      userStats = {
        ...stats,
        currentLevelPoints: stats.totalPoints % stats.pointsPerLevel,
      };
    });

    // Clean up subscription on component unmount
    return unsubscribe;
  });
</script>

<div class="points-container">
  <h1 class="stats">Stats</h1>
  <!-- Display calculated total points and level -->
  <p>Total Generated Points: {userStats.totalPoints}</p>
  <!-- Display current points within the current level -->
  <p>Current Level Points: {userStats.currentLevelPoints}</p>
  <!-- Progress bar for level completion -->
  <div class="progress-bar">
    <div
      class="progress"
      style="width: {(userStats.currentLevelPoints / userStats.pointsPerLevel) *
        100}%;"
    ></div>
    <div class="level-text">Lvl. {userStats.level}</div>
  </div>
</div>

<style lang="scss">
  .points-container {
    margin-top: 20px;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    height: 20px;
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
    background: linear-gradient(
      135deg,
      var(--accent-gold),
      var(--accent-orange)
    );
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
