<script lang="ts">
  import { FlowChartIcon, CloudIcon, HistoryLineIcon, CalendarBlankIcon } from '$components/icons'

  interface Props {
    selectedTab?: string
    onSelect?: (value: string) => void
  }

  let {
    selectedTab = 'workflows',
    onSelect
  }: Props = $props()
</script>

<div class="flex gap-4 text-sm text-textSub600">
  <button
    class="flex gap-1 py-2 items-center"
    onclick={() => onSelect?.('workflows')}
    class:isSelected={selectedTab === 'workflows'}
  >
    <FlowChartIcon />
    Workflows
  </button>
  <button
    class="flex gap-1 py-2 items-center"
    onclick={() => onSelect?.('deployments')}
    class:isSelected={selectedTab === 'deployments'}
  >
    <CloudIcon />
    Deployments
  </button>
  <button
    class="flex gap-1 py-2 items-center"
    onclick={() => onSelect?.('history')}
    class:isSelected={selectedTab === 'history'}
  >
    <HistoryLineIcon />
    Execution History
  </button>
  <button
    class="flex gap-1 py-2 items-center"
    onclick={() => onSelect?.('schedule')}
    class:isSelected={selectedTab === 'schedule'}
  >
    <CalendarBlankIcon />
    Schedule
  </button>
</div>

<style lang="postcss">
  .isSelected {
    color: var(--text-strong-950) !important;
    border-bottom: 2px solid var(--primary-base);
  }
</style>

