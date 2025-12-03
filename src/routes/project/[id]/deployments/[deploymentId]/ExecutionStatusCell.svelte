<script lang="ts" generics="T">
  import { DeploymentStatus } from '$components/pages/deployments'

  interface Props {
    row: Record<string, any>
  }

  const { row }: Props = $props()
</script>

<div class="flex"><DeploymentStatus status={row.state} /></div>
