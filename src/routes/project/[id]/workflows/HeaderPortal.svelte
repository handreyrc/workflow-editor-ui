<script lang="ts">
  import { Portals } from '$lib/constants/ui'
  import { portal } from '$lib/utils/dom/portal'

  import { PlusIcon, SettingsIcon } from '$components/icons'
  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import { Button } from '$components/common/ui'

  interface Props {
    isFormOpen: boolean
    isEdit: boolean
  }

  let {
    isFormOpen = $bindable(false),
    isEdit = $bindable(false),
  }: Props = $props()
</script>

<div
  use:portal={Portals.PageHeader}
  class="flex items-center gap-4"
>
  <Button
    size="small"
    isLoading={isFormOpen}
    onClick={() => isFormOpen = true}
    icon={PlusIcon}
    iconSize={14}
    iconPosition="right"
  >
    New Workflow
  </Button>

  <Tooltip
    content="Project Settings"
  >
    <Button
      type="empty"
      className="text-primaryBase center"
      onClick={() => isEdit = true}
      icon={SettingsIcon}
    />
  </Tooltip>
</div>



