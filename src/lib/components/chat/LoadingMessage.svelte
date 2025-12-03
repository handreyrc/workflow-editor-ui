<script lang="ts">
  import BaseImage from '$assets/images/message_loading_base.svg'
</script>
<div class="relative w-8 h-8">
  <img src={BaseImage} alt="Loading" class="w-8 h-8 loading-base" />
  <div class="absolute inset-0 dots-spin">
    <span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primaryBase"></span>
    <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primaryBase"></span>
  </div>
</div>

<style lang="postcss">
  .loading-base {
    animation: dots-spin 0.5s infinite linear;
  }

  .dots-spin {
    animation: dots-spin 1s infinite linear;
  }

  @keyframes dots-spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
</style>
