<script>
  // @ts-nocheck

  import { selectedTaskStoreSecond, tasksStore } from "$lib/stores/tasksStore";
  import { editTask } from "$lib/stores/database";
  import { notificationType } from "$lib/stores/notificationsStore";
  import { userStatsStore } from "$lib/stores/tasksStore";

  function convertTimestamp(timestamp, format = "full") {
    let date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    let mm = date.getMonth() + 1; // Get month (adding 1 because getMonth() returns zero-based index)
    let dd = date.getDate(); // Get day of the month
    let yyyy = date.getFullYear(); // Get full year
    let hh = date.getHours(); // Get hours (in 24-hour format)
    let min = date.getMinutes(); // Get minutes
    let ss = date.getSeconds(); // Get seconds

    // Ensure mm, dd, hh, min, and ss are formatted with leading zeros if necessary
    let formattedMM = mm < 10 ? "0" + mm : mm;
    let formattedDD = dd < 10 ? "0" + dd : dd;
    let formattedHH = hh < 10 ? "0" + hh : hh;
    let formattedMin = min < 10 ? "0" + min : min;
    let formattedSS = ss < 10 ? "0" + ss : ss;

    // Construct the formatted date string based on the format argument
    switch (format) {
      case "full":
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
      case "time":
        return `${formattedHH}:${formattedMin}:${formattedSS}`;
      case "date":
        return `${formattedMM}/${formattedDD}/${yyyy}`;
      default:
        // If an invalid format argument is provided, return the full date by default
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
    }
  }

  // Function to mark the task as completed
  async function completeTask() {
    const task = $selectedTaskStoreSecond; // Get the selected task from the store

    // Get the current time in milliseconds
    const currentTime = convertTimestamp(
      Date.now(),
      "time",
    ); // Parse current time

    // Convert the createdAt timestamp to milliseconds using convertTimestamp function
    const timestamp = convertTimestamp(
      $selectedTaskStoreSecond.createdAt,
      "time",
    ); // Parse as float

    console.log("Milliseconds: ", currentTime);

    // Calculate the time difference in minutes between currentTime and createdAt
    const timeDifferenceMinutes = (currentTime - timestamp) / (1000 * 60);

    console.log(
      "Time difference since task creation (minutes):",
      timeDifferenceMinutes,
    );

    // Check if at least 30 minutes have passed since the task was created
    if (timeDifferenceMinutes < 30) {
      console.log(
        "Cannot mark task as complete. Minimum time requirement not met.",
      );
      notificationType.set(3); // Set notification type for time requirement not met
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
