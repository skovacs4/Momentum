<script>
  import { onMount, onDestroy } from 'svelte';
  import { calculateUsersPointsAndLevels } from '$lib/stores/database';

  /**
   * @type {any[]}
   */
  let usersData = [];

  onMount(async () => {
    try {
      // Fetch users' points and levels data
      usersData = await calculateUsersPointsAndLevels();
    } catch (error) {
      console.error('Error fetching users\' points and levels:', error);
    }
  });

  onDestroy(() => {
    // Clean up any resources if needed
  });
</script>

<h1>Leaderboard</h1>

<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>User ID</th>
      <th>Total Points</th>
      <th>Level</th>
    </tr>
  </thead>
  <tbody>
    {#each usersData as user, index (user.userId)}
      <tr>
        <td>{index + 1}</td>
        <td>{user.userId}</td>
        <td>{user.totalPoints}</td>
        <td>{user.level}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    color: #333;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
</style>
