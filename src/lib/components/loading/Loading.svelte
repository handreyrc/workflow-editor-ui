<script>
    import { onMount } from 'svelte';
    import animationPath from "$assets/loading.json"; // Directly import animation JSON
    let animationContainer = $state();

    onMount(async () => {
        const { default: lottie } = await import('lottie-web'); // Dynamically import lottie-web

        const animationOptions = {
            container: animationContainer, // DOM element for the animation
            renderer: 'svg', // Render as SVG
            loop: true, // Enable looping
            autoplay: true, // Start animation automatically
            animationData: animationPath, // Use imported JSON directly
        };

        const animation = lottie.loadAnimation(animationOptions);

        return () => {
            if (animation) {
                animation.destroy(); // Clean up on unmount
            }
        };
    });
</script>

<!-- Animation Container -->
<div class="animation-container" bind:this={animationContainer}></div>

<style>
    .animation-container {
        background: transparent;
        width: 100%;
        max-width: 300px; /* Ensure responsiveness */
        height: auto;
        aspect-ratio: 1; /* Maintain square aspect ratio */
    }
</style>