<script lang="ts">
  import { Breadcrumbs, PageHeader } from '$components/header'

  import EmptyScreen from './EmptyScreen.svelte'
</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[{ link: '', title: 'Tasks' }]} />
  {/snippet}
</PageHeader>

<div class="grow center">
  <EmptyScreen onAdd={() => {}} />
</div>

