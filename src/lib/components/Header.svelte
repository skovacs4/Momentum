<script>
  import { authHandlers, authStore } from "$lib/stores/authStore";
  import { BiHomeAlt2 } from "svelte-icons-pack/bi";
  import { AiOutlineHistory } from "svelte-icons-pack/ai";
  import { TrOutlineCrown } from "svelte-icons-pack/tr";
  import { CiLogout } from "svelte-icons-pack/ci";
  import { Icon } from "svelte-icons-pack";

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  // Close the mobile menu when a link is clicked
  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<header>
  <button class="menu-icon" on:click={toggleMenu} aria-label="Toggle Menu"
    >&#9776;</button
  >

  <div class="overlay" class:show={isMenuOpen}></div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <nav class:open={isMenuOpen} on:click={closeMenu}>
    <button class="close-icon" on:click={closeMenu} aria-label="Close Menu"
      >&times;</button
    >
    {#if !$authStore.currentUser}
      <a href="/login">Login</a>
    {:else}
      <a href="/"><Icon src={BiHomeAlt2} className="menu-icon" />Home</a>
      <a href="/history"><Icon src={AiOutlineHistory} />History</a>
      <a href="/leaderboard"><Icon src={TrOutlineCrown} />Leaderboard</a>
      <a href="/" on:click|preventDefault={authHandlers.logout}
        ><Icon src={CiLogout} />Log Out</a
      >
    {/if}
  </nav>

  <a href="/" class="logo-header-container">
    <img src="assets/logo-pixel.png" alt="logo" class="logo-header" />
  </a>
</header>

<style lang="scss">
  header {
    z-index: 15;
  }

  @media screen and (max-width: 768px) {
    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
      z-index: 8; /* Below the navigation, but above the rest */

      &.show {
        display: block;
      }
    }

    header {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      transition:
        opacity 0.3s ease,
        visibility 0s linear 0.3s;
      nav {
        // display: none;
        position: fixed;
        top: 0;
        left: -100%; /* Start off-screen */
        width: 82.5%;
        height: 100%;
        background-color: rgb(32 33 45);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 9;
        padding: 75px 0px;
        transition: left 0.3s ease; /* Transition the left position */

        .close-icon {
          display: none;
        }

        &.open {
          display: block;
          // transform: translateX(0);
          left: 0; /* Slide in from the left */

          .close-icon {
            display: block;
            align-self: flex-end;
            margin-right: 10px;
            font-size: 36px;
            cursor: pointer;
            background: none;
            border: none;
            color: var(--primary-color);
            transition: color 0.3s ease;
            position: absolute;
            right: 10px;
            top: 10px;

            &:hover {
              color: var(--accent-orange);
            }
          }
        }

        a {
          display: block;
          padding: 15px;
          text-align: left;
          color: var(--primary-color);
          font-weight: 500;
          transition: color 0.3s ease;
          text-decoration: none;
          font-size: 26px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding-left: 25px;

          .menu-icon {
            font-size: 32px;
          }

          &:hover {
            color: var(--accent-orange);
          }
        }
      }

      .logo-header-container {
        img {
          width: 75px;
        }
      }
    }

    button.menu-icon {
      display: block;
      cursor: pointer;
      padding: 15px;
      // color: var(--primary-color);
      color: #dedede;
      font-weight: 500;
      transition: color 0.3s ease;
      border: none;
      font-size: 32px;
      background: none;

      &:hover {
        color: var(--accent-orange);
      }
    }
  }

  @media screen and (min-width: 769px) {
    header {
      z-index: 10;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #3f3f3f;

      .overlay {
        display: none;
      }

      nav {
        text-align: center;
        border-radius: 26px;
        display: flex;

        .current-page {
          color: var(--accent-orange); /* Or your desired hover style */
        }

        .close-icon {
          display: none;
        }

        a {
          text-decoration: none;
          // color: var(--primary-color);
          color: var(--text);
          padding: 25px;
          line-height: 32px;
          position: relative;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;

          &::after {
            content: "";
            position: absolute;
            bottom: 1px;
            left: 50%;
            transform: translate(-50%, 50%);
            width: 0;
            height: 2px;
            background-color: var(--accent-orange);
            transition: width 0.3s ease;
          }

          &:hover::after {
            width: calc(100% - 50px);
          }

          &:visited {
            color: var(--text);
          }

          &:hover {
            color: var(--accent-orange);
          }
        }
      }

      .logo-header {
        width: 75px;
      }

      .logo-header-container {
        padding-right: 2.5%;
      }
    }

    button.menu-icon {
      display: none; /* Hide hamburger menu button on desktop */
    }
  }
</style>
