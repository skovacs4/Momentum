<!-- Notification.svelte -->

<script>
  // @ts-nocheck

  import { RiSystemCloseLargeLine } from "svelte-icons-pack/ri";
  import { Icon } from "svelte-icons-pack";
  import { notificationType } from "$lib/stores/notificationsStore";
  import { onDestroy, onMount } from "svelte";

  let message = "";
  let icon = "";

  const unsubscribe = notificationType.subscribe((value) => {
    switch (value) {
      case 0:
        message = "+3 points received";
        icon = "🪙";
        break;
      case 1:
        message = "The task has been added successfully!";
        icon = "✅";
        break;
      case 2:
        message = "The task has been edited successfully!";
        icon = "✅";
        break;
      case 3:
        message =
          "Please wait at least 30 minutes before setting a task as complete!";
        icon = "⌚";
        break;
      case 4:
        message =
          "Congratulations! You have reached new heights!";
        icon = "🎉";
        break;
      default:
        message = "";
        icon = "";
        break;
    }

    // Automatically close the notification after 3000 milliseconds (3 seconds)
    if (value !== null) {
      setTimeout(() => {
        notificationType.set(null); // Reset the notification type after timeout
      }, 4000);
    }
  });

  onDestroy(unsubscribe); // Clean up subscription when component is destroyed

  // Function to close the notification immediately
  function closeNotification() {
    notificationType.set(null); // Reset the notification type
  }
</script>

{#if message && icon}
  <div class="notification">
    <p>{message}</p>
    <span class="icon">{icon}</span>
    <button on:click={closeNotification}
      ><Icon src={RiSystemCloseLargeLine} className="close-icon" /></button
    >
  </div>
{/if}

<style lang="scss">
  @media screen and (max-width: 768px) {
    .notification {
      max-width: 75%;
      width: 100%;
    }
  }

  .notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 8px;
    padding: 20px 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    // max-width: 300px;
    z-index: 1000;
    height: 50px;
  }

  .notification p {
    margin: 0;
    font-size: 16px;
    color: #333333;
  }

  .notification .icon {
    font-size: 24px;
  }

  .notification button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    margin-left: 10px;
  }
</style>
