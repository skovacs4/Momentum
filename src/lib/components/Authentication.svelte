<script>
  import { onMount } from "svelte";
  import { authHandlers, authStore } from "../stores/authStore";
  import { doc, setDoc } from "firebase/firestore"; // Import for Firestore

  let register = false;
  let email = "";
  let password = "";
  let confirmPassword = "";
  let username = ""; // Variable for the username

  onMount(() => {
    // Add custom class to <body> when component mounts
    document.body.classList.add("auth-page");

    // Clean up by removing the class when component is unmounted
    return () => {
      document.body.classList.remove("auth-page");
    };
  });

  async function handleSubmit() {
    if (
      !email ||
      !password ||
      (register && !confirmPassword) ||
      (register && !username)
    ) {
      return;
    }

    if (register && password === confirmPassword) {
      try {
        const userCredential = await authHandlers.signup(
          email,
          password,
          username
        );
        // @ts-ignore
        const userId = userCredential.user.uid;

        // Store username in Firestore
        // @ts-ignore
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          username,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await authHandlers.login(email, password);
      } catch (err) {
        console.log(err);
      }
    }
    if ($authStore.currentUser) {
      window.location.href = "/";
    }
  }
</script>

<div class="auth-container">
  <div class="form-container">
    <h1>{register ? "Register" : "Login"}</h1>
    <form>
      <label>
        <input bind:value={email} type="email" placeholder="Email" />
      </label>
      <label>
        <input bind:value={password} type="password" placeholder="Password" />
      </label>
      {#if register}
        <label>
          <input bind:value={username} type="text" placeholder="Username" />
        </label>
        <label>
          <input
            bind:value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
          />
        </label>
      {/if}
      <button on:click={handleSubmit}>Submit</button>
    </form>
    {#if !register}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="switch">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        Don't have an account?
        <span
          on:click={() => {
            register = true;
          }}>Sign Up</span
        >
      </div>
    {:else}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="switch">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        Already have an account?
        <span
          on:click={() => {
            register = false;
          }}>Login</span
        >
      </div>
    {/if}
  </div>
  <div class="image-container">
    <!-- Replace 'image-url.jpg' with your actual image URL -->
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src="assets/wonder-1.png" alt="Authentication Image" />
  </div>
</div>

<style lang="scss">

  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full viewport height */
    background-color: #f9f9f9;
  }

  .form-container {
    width: 50%;
    padding: 50px;
    box-sizing: border-box; /* Ensure padding doesn't increase element size */
    text-align: center;
  }

  .image-container {
    display: flex;
    justify-content: right;
    padding-bottom: 75px;
  }

  h1 {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
	text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 15px;
  }

  input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 500px;
  }

  button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    background-color: #6a1b9a;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
	width: 525px;
	margin: auto;
  }

  button:hover {
    background-color: #4b1464;
  }

  .switch {
    margin-top: 20px;
    font-size: 14px;
  }

  span {
    color: #6a1b9a;
    cursor: pointer;
    text-decoration: underline;
  }

  img {
    max-width: 100%; /* Ensure image fits container width */
    height: auto;
    border-radius: 0 8px 8px 0; /* Rounded corners on the right side */
  }
</style>
