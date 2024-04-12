<!-- 404 Page -->
<template>
    <div class="container">
        <img src="path/to/404-image.png" alt="404 Image" class="image" />
        <p class="text">Oops! The page you're looking for doesn't exist.</p>
    </div>
</template>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Full viewport height */
    }

    .image {
        width: 300px; /* Adjust image width as needed */
        height: auto;
        margin-bottom: 30px;
    }

    .text {
        font-size: 24px;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
    }
</style>
