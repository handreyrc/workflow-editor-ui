<script lang="ts">
  import { derived } from 'svelte/store'

  import { selectedProjectSelector } from '$lib/stores/projectsStore'
  import { workflowsSelectedWorkflowSelector, workflowsSelector } from '$lib/stores/workflowStore'

  import {
    CloudArrowUp,
    SaveIcon,
    SettingsIcon,
  } from '$components/icons'
  import { Breadcrumbs, PageHeader } from '$components/header'
  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import { Button } from '$components/common/ui'

  interface Props {
    isEdit: boolean
    isDeployOpen: boolean
    onSave: () => void
  }

  let {
    isEdit = $bindable(false),
    isDeployOpen = $bindable(false),
    onSave
  }: Props = $props()

  const project = derived(selectedProjectSelector, (store) => store)
  const workflow = workflowsSelectedWorkflowSelector
  const isLoading = derived(workflowsSelector, (store) => store?.isGenerating)
  const isSaved = derived(workflowsSelector, (store) => store?.isSaved)
</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[
      { link: '/project', title: 'Projects' },
      { link: `/project/${$project?.id || ''}/workflows`, title: $project?.name || '' },
      { link: '', title: $workflow?.name || '' }
    ]} />
  {/snippet}
  {#snippet content()}
    <div class="flex align-center gap-4">
      <Button
        fill={!$isSaved}
        size="small"
        type="primary"
        onClick={onSave}
        isDisabled={$isLoading}
        icon={SaveIcon}
        iconSize={12}
      >
        Save
      </Button>
      <Button
        size="small"
        onClick={() => isDeployOpen = true}
        isDisabled={$isLoading}
        icon={CloudArrowUp}
      >
        Deploy
      </Button>

      <Tooltip
        content="Workflow Settings"
      >
        <Button
          type="empty"
          icon={SettingsIcon}
          className="text-primaryBase"
          onClick={() => isEdit = true}
        />
      </Tooltip>
    </div>
  {/snippet}
</PageHeader>

<div class="bg-bgSection h-[48px] shrink-0 border-b border-strokeSoft200 flex items-center justify-between px-4">
  <div class="max-w-1/2">
    <span class="text-textSub600 text-xs line-clamp-2">
      {$workflow?.description || $workflow?.content?.workflow?.description || 'No description yet'}
    </span>
  </div>
</div>
