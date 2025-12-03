<script lang="ts">
  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  onMount(() => {
    goto(`/project/${page.params.id}/workflows`)
  })
</script>

