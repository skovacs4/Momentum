<!-- CharacterSelectorModal.svelte -->
<script>
// @ts-nocheck

    // let characters = [
      // {
      //   name: 'Character 1',
      //   embedUrl: 'https://sketchfab.com/models/019f4b3fd3c74ed0bc6c8dbe9cd50d51/embed?autostart=1&preload=1'
      // },
    //   {
    //     name: 'Character 2',
    //     embedUrl: 'https://sketchfab.com/models/9311de5091774973ac166dc4f4fc850b/embed?autostart=1&preload=1'
    //   },
    //   {
    //     name: 'Character 3',
    //     embedUrl: 'https://sketchfab.com/models/7d93273c207345ebab56758e1965843f/embed?autostart=1&preload=1'
    //   },
    //   {
    //     name: 'Character 4',
    //     embedUrl: 'https://sketchfab.com/models/28de1ef33c18471ab385452779f2ba32/embed?autostart=1&preload=1'
    //   },
    //   {
    //     name: 'Character 5',
    //     embedUrl: 'https://sketchfab.com/models/12eada5bf8494fc1ad263385a1b8ef7e/embed?autostart=1&preload=1'
    //   },
    //   {
    //     name: 'Character 6',
    //     embedUrl: 'https://sketchfab.com/models/019f4b3fd3c74ed0bc6c8dbe9cd50d51/embed?autostart=1&preload=1'
    //   },
    
    //];

    let characters = [
      {
        name: 'Character 1',
        embedUrl: 'https://sketchfab.com/models/019f4b3fd3c74ed0bc6c8dbe9cd50d51/embed?autostart=1&preload=1'
      },
    ]
  
    let showModal = false;
    let selectedCharacter = null;
  
    function openModal() {
      showModal = true;
    }
  
    function closeModal() {
      showModal = false;
    }
  
    /**
     * @param {{ name: string; embedUrl: string; }} character
     */
    function selectCharacter(character) {
      selectedCharacter = character;
      console.log('Selected Character:', character);
      // Close the modal when a character is selected
      closeModal();
    }
  </script>
  
  <button on:click={openModal}>Select Character</button>
  
  {#if showModal}
    <div class="modal">
      <div class="modal-content">
        <h2>Select a Character</h2>
        <div class="character-grid">
          {#each characters as character}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="character-item" on:click={() => selectCharacter(character)}>
              <!-- Invisible overlay with hover effect -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="overlay" on:click={closeModal} />
              <iframe
                title={character.name}
                src={character.embedUrl}
                frameborder="0"
                allowfullscreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                xr-spatial-tracking
                execution-while-out-of-viewport
                execution-while-not-rendered
                web-share
              ></iframe>
            </div>
          {/each}
        </div>
        <button on:click={closeModal}>Close</button>
      </div>
    </div>
  {/if}
  
  <style>
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
  
    .modal-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      width: 80%;
      max-width: 600px;
    }
  
    .character-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
  
    .character-item {
      position: relative;
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    .character-item:hover {
      transform: scale(1.05);
      transition: transform 0.3s ease;
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      opacity: 0; /* Invisible by default */
    }
  
    iframe {
      width: 100%;
      height: 200px;
      border: none;
    }
  
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  </style>
  