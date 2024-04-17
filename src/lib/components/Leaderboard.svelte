<script>
  import { onMount, onDestroy } from "svelte";
  import { calculateUsersPointsAndLevels } from "$lib/stores/database";
  import { auth } from "$lib/firebase";

  /**
   * @type {string | any[]}
   */
  let usersData = []; // Initialize usersData as an empty array

  // Fetch users' points and levels data when the component mounts
  onMount(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        usersData = await calculateUsersPointsAndLevels(); // Fetch user data
      } catch (error) {
        console.error("Error fetching users' points and levels:", error);
      }
    }
  });

  // Optional: Clean up resources on component destroy
  onDestroy(() => {
    // Clean up any resources if needed
  });
</script>

<div class="leaderboard">
  <img src="assets/leaderboard-cover.png" alt="Banner" class="banner" />
  <img src="assets/king-1.png" alt="Logo" class="king_img" />
  <h1>Leaderboard</h1>

  {#if usersData.length > 0}
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Total Points</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        {#each usersData as user, index (user.userId)}
          {#if user.totalPoints > 0}
            <tr>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.totalPoints}</td>
              <td>{user.level}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<style lang="scss">
  .leaderboard {
    .banner {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .leaderboard {
      h1 {
        text-align: left;
        color: var(--text); /* Purple */
        padding-left: 10px;
        font-size: 21px;
      }

      table {
        width: 100%;
        padding: 10px;
        margin: 0;
        font-size: 14px;
      }

      .king_img {
        width: 125px;
        display: none;
      }

      .banner {
        display: block;
      }
    }
  }

  /* Ensure the table is scrollable within a minimum height */
  // @media (min-width: 768px) {
  /* Component Styles */
  h1 {
    text-align: center;
    color: var(--text); /* Purple */
  }

  .leaderboard {
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative; /* Ensure positioning context for pseudo-element */
  }

  .king_img {
    align-self: center;
    z-index: 5;
    width: 250px;
  }

  table {
    width: 75%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    margin: 50px auto;
    z-index: 5;
    color: var(--text);
  }

  th,
  td {
    padding: 12px;
    text-align: left;
  }

  th {
    // background-color: #f2f2f2;
    text-transform: uppercase;
    font-weight: bold;
    border: 1px solid var(--text);
  }

  tr:nth-child(even) {
    // background-color: #f9f9f9;
  }

  tr:hover {
    // background-color: #f1f1f1;
  }

  /* Top 3 Styling */
  tbody tr:nth-child(-n + 3) td {
    font-weight: bold;
  }

  /* Top Player Styling */
  tbody tr:first-child td {
    position: relative;
    background-color: var(--accent-gold); /* Gold */
    font-weight: bold;
    color: var(--primary-color);
  }

  tbody tr:first-child td:first-child:before {
    content: "";
    position: absolute;
    top: 10px;
    right: 25px;
    background: url("https://img.icons8.com/ios/50/000000/crown--v1.png")
      no-repeat;
    width: 20px;
    height: 20px;
    background-size: contain;
  }
  // }
</style>
