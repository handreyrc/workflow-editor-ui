<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { writable } from 'svelte/store'

  import { userProfile } from '$lib/stores/authStore'
  import { initAuthorization } from '$lib/services/authService'
  import { createPortal } from '$lib/utils/dom/portal'
  import { monacoInitializer } from '$lib/utils/initializers'
  import { Portals } from '$lib/constants/ui'
  import { initializeToaster } from '$lib/stores/toastsStore'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import MainSideBar from '$components/sidebar/MainSideBar.svelte'
  import Toaster from '$components/common/ui/Toaster.svelte'


  import '../app.css'

  interface Props {
    children?: Snippet
  }

  let { children }: Props = $props()

  let isExpanded = writable(false)
  let isPageLoading = $state(true)

  onMount(() => {
    initAuthorization()
    monacoInitializer()
    initializeToaster()
  })

  $effect(() => {
    isPageLoading = $userProfile === null
  })
</script>

<Toaster />
{#if isPageLoading}
  <GlobalLoader/>
{:else}
  <MainSideBar isExpanded={isExpanded}/>
  <div
    id="main-layout"
    class="flex flex-col min-h-svh bg-bg-color max-h-screen"
    class:isExpanded={$isExpanded}
  >
    <main class="min-h-0 main-wrapper flex-1 flex flex-col">
      {@render children?.()}
    </main>
  </div>
{/if}

<div use:createPortal={Portals.Modal}></div>

<style lang="postcss">
  #main-layout {
    margin-left: 54px;
    transition: margin-left 0.3s ease;
  }

  #main-layout.isExpanded {
    margin-left: 250px;
  }

  @keyframes spin {
    to {
        transform: rotate(360deg);
    }
  }
</style>
