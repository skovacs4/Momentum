<script>
  // @ts-nocheck

  import { selectedTaskStoreSecond, tasksStore } from "$lib/stores/tasksStore";
  import { editTask } from "$lib/stores/database";
  import { notificationType } from "$lib/stores/notificationsStore";
  import { userStatsStore } from "$lib/stores/tasksStore";
  import { Timestamp } from "firebase/firestore";

  const currentTimestamp = Timestamp.now(); // Get current Firestore Timestamp

  // Function to convert Firestore Timestamp to JavaScript Date
  function timestampToDate(timestamp) {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000); // Convert to milliseconds
  }

  // Function to calculate time difference in minutes
  function calculateTimeDifferenceInMinutes(timestamp1, timestamp2) {
    const date1 = timestampToDate(timestamp1);
    const date2 = timestampToDate(timestamp2);
    const differenceInMilliseconds = date1 - date2;
    return differenceInMilliseconds / (1000 * 60); // Convert milliseconds to minutes
  }

  // Function to mark the task as completed
  async function completeTask() {
    const task = $selectedTaskStoreSecond; // Get the selected task from the store
    const createdAtTimestamp = $selectedTaskStoreSecond.createdAt;

    console.log("Standard format:", createdAtTimestamp);

    // Calculate time difference in minutes
    const timeDifferenceMinutes = calculateTimeDifferenceInMinutes(
      currentTimestamp,
      createdAtTimestamp,
    );

    console.log(
      "Time difference since task creation (minutes):",
      timeDifferenceMinutes,
    );

    // Check if at least 30 minutes have passed since task creation
    if (timeDifferenceMinutes < 30) {
      console.log(
        "Cannot mark task as complete. Minimum time requirement not met.",
      );
      notificationType.set(3); // Set notification type for time requirement not met
      closeModal(); // Close the modal
      return; // Exit the function or show an error message to the user
    }

    try {
      // Set task to completed in the database
      await editTask(task.id, { completed: true });
      console.log("Task marked as complete!");

      // Update tasksStore with the modified task
      tasksStore.update((tasks) => {
        // Find the task in the tasksStore and update its completed status
        const updatedTasks = tasks.map((t) => {
          if (t.id === task.id) {
            return { ...t, completed: true };
          }
          return t;
        });

        return updatedTasks;
      });

      // Update userStats after completing the task
      userStatsStore.update((stats) => {
        const updatedTotalPoints = stats.totalPoints + 3; // Add 3 points for completing a task

        return {
          ...stats,
          totalPoints: updatedTotalPoints,
          level: Math.floor(updatedTotalPoints / stats.pointsPerLevel) + 1,
          currentLevelPoints: updatedTotalPoints % stats.pointsPerLevel,
        };
      });

      notificationType.set(0); // Trigger +3 points notification
    } catch (error) {
      console.error("Error editing the task:", error);
    } finally {
      // Reset the selected task in the store
      selectedTaskStoreSecond.set(null);
    }
  }

  // Function to cancel and close the modal
  function closeModal() {
    selectedTaskStoreSecond.set(null); // Reset the selected task
  }
</script>

<div
  class="modal"
  style={`display: ${$selectedTaskStoreSecond ? "block" : "none"};`}
>
  <div class="modal-content">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-header">
      <h2>Set task as completed?</h2>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span class="close" on:click={closeModal}>&times;</span>
    </div>
    <div class="modal-footer">
      <button on:click={completeTask}>Continue</button>
      <button on:click={closeModal}>Cancel</button>
    </div>
  </div>
</div>

<style lang="scss">
  /* Modal styles */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    padding-top: 60px; /* Location of the box */
  }

  /* Show modal if selectedTaskStoreSecond has a value */
  .modal.show {
    display: block;
  }

  .modal-content {
    background-color: var(--magic-purple);
    margin: auto;
    padding: 20px;
    border: 1px solid #333;
  }

  .modal-header,
  .modal-footer {
    padding: 10px 0;
    text-align: center;

    h2 {
      text-align: center;
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
  }

  .modal-footer {
    display: flex;
    justify-content: center;

    button {
      margin: 0 10px;
    }
  }
</style>
