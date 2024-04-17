<script>
    import { page } from "$app/stores";

    const errorMessage = $page.error?.message || "Page not found";

    // Handle navigation back to home page
    function navigateHome() {
        window.location.href = "/"; // Redirect to the home page
    }
</script>

<div class="error-page">
    <div class="container">
        <div class="image-container">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="assets/wonder-6-transparent.png" alt="404 Image" />
        </div>
        <h1>Oops! You've ventured off the map. Let's get you back on track.</h1>
        <a href="/">Go back</a>
    </div>
</div>

<style lang="scss">
    .error-page {
        // background-color: var(--magic-purple);
        min-height: 100vh;
    }
    .container {
        max-width: 700px;
        text-align: center;
        padding: 50px;
        margin: 25px auto;
        .image-container {
            img {
                width: 350px;
            }
        }

        h1 {
            color: white;
        }

        a {
            color: white;
        }
    }
</style>
