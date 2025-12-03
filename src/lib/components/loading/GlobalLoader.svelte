<script lang="ts">
  interface Props {
    internalLoader?: boolean
  }

  let { internalLoader = false }: Props = $props()
</script>

<div
  class:internalLoader={internalLoader}
  class:loading-icon={!internalLoader}
  aria-busy="true"
  aria-label="Loading..."
  data-testid="global-loader"
>
  <div role="status">
    <div class="w-8 h-8 border-2 border-primaryBase border-t-strokeSoft200 rounded-full animate-spin"></div>
  </div>
</div>

<style>
  .internalLoader {
    margin: auto;
  }

  .loading-icon {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
