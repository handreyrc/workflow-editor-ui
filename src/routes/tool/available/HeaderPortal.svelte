<script lang="ts">
  import { Portals } from '$lib/constants/ui'
  import { portal } from '$lib/utils/dom/portal'

  import { PlusIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  interface Props {
    isAddFormOpen: boolean
  }

  let { isAddFormOpen = $bindable(false) }: Props = $props()
</script>

<div use:portal={Portals.PageHeader}>
  <Button
    size="small"
    onClick={() => isAddFormOpen = true}
    icon={PlusIcon}
    iconSize={14}
    iconPosition="right"
  >
    Custom Tool
  </Button>
</div>
