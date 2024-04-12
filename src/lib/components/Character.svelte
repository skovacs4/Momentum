<script>
    import { onMount } from 'svelte';
    import { calculateUserPointsAndLevel } from '$lib/stores/database';
    import { auth } from '$lib/firebase';
  
    // Initialize variables to hold user data
    let totalPoints = 0;
    let level = 1;
    let startCharacter = ''; // Initialize startCharacter
  
    // Function to fetch and calculate user points and level on component mount
    onMount(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const { totalPoints: userTotalPoints, level: userLevel } = await calculateUserPointsAndLevel(user.uid);
          totalPoints = userTotalPoints;
          level = userLevel;
          console.log('Level: ' + level, 'Total Points: ' + totalPoints);
  
          // Update startCharacter based on the fetched level
          startCharacter = characters[level - 1]; // Adjust index since level starts from 1
          console.log('Start Character: ' + startCharacter);
        } catch (error) {
          console.error('Error fetching user points and level:', error);
        }
      }
    });
  
    // Define the character paths based on levels
    const characters = [
      "characters/bull-pixel.png",   // Level 1
      "characters/cat-pixel.png",    // Level 2
      "characters/dog-pixel.png",    // Level 3
      "characters/wolf-pixel.png",   // Level 4
      "characters/tiger-pixel.png",  // Level 5
      "characters/lion-pixel.png",   // Level 6
      "characters/bear-pixel.png",   // Level 7
      "characters/rhino-pixel.png",  // Level 8
      "characters/rhino-pixel-2.png",  // Level 9
    ];
  </script>
  
  <div class="character">
    <!-- Display the character image based on the current startCharacter path -->
    <img src={startCharacter} alt="Character">
  </div>
  
  <style>
    /* Styling for the character image */
    img {
      width: 200px; /* Set a fixed width for the character image */
      height: auto; /* Maintain aspect ratio */
      margin-top: 20px; /* Add top margin for spacing */
    }
  </style>
  