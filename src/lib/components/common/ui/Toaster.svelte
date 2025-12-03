<script lang="ts">
  import { Toaster as SkeletonToaster } from '@skeletonlabs/skeleton-svelte'

  import { toasterSelector } from '$lib/stores/toastsStore'
</script>

{#if $toasterSelector}
  <SkeletonToaster
    toaster={$toasterSelector}
    base="toast bg-bgSection border border-strokeSoft200 rounded-md bottom-8!"
    messageBase="toast__message"
    titleBase="text-[17px] font-semibold"
    descriptionClasses="text-textSub600"
    btnDismissBase="absolute top-2 right-3"
    stateSuccess="toast__success"
    stateError="toast__error"
    stateWarning="toast__warning"
    max={4}
  />
{/if}
