<script lang="ts">
  import { Theme, theme } from '$lib/services/themeService'

  import { PlusIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  import EmptyWorkflowsIcon from '$assets/images/emptyworkflow.svg'
  import EmptyWorkflowsLightIcon from '$assets/images/emptyworkflow_light.svg'

  interface Props {
    onAdd: () => void
  }

  const {
    onAdd
  }: Props = $props()
</script>

<div class="center w-full h-full">
  <div class="center flex-col text-center">
    <div class="center">
      <img src={$theme === Theme.Dark ? EmptyWorkflowsIcon : EmptyWorkflowsLightIcon} alt="empty project" />
    </div>
    <h1 class="text-[18px] font-bold mb-2 mt-3">Start adding Workflows</h1>
    <p class="text-[13px] mb-2">No workflows available. Get started by creating one!</p>
    <Button
      className="mt-2"
      onClick={onAdd}
      icon={PlusIcon}
      iconSize={12}
    >
      Add Workflow
    </Button>
  </div>
</div>
