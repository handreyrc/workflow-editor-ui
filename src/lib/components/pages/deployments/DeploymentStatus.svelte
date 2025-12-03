<script lang="ts">
  import cx from 'classnames'

  import { DeploymentStatus as Status, ExecutionStatus } from '$lib/types/deployment'
  import { DeploymentStatuses } from '$lib/constants/deployments'

  import { CheckFillIcon, AlertFillIcon, ErrorFillIcon } from '$components/icons'

  interface Props {
    status: Status | ExecutionStatus
    className?: string
  }

  const { status, className }: Props = $props()
</script>

<div class={cx(className, 'flex items-center gap-1 bg-bgWhite0 border border-strokeSoft200 rounded-md p-1 pr-2 text-xs text-textSub600')}>
  {#if status === Status.READY || status === Status.BUILD_SUCCESS || status === Status.DEPLOY_SUCCESS || status === ExecutionStatus.COMPLETED}
    <span class="text-successBase"><CheckFillIcon width={16} height={16} /></span>
  {/if}
  {#if status === Status.DEPLOY_IN_PROGRESS}
    <span class="text-warningBase"><AlertFillIcon width={16} height={16} /></span>
  {/if}
  {#if status === Status.BUILD_FAILED || status === Status.DEPLOY_FAILED || status === ExecutionStatus.ERROR}
    <span class="text-errorBase"><ErrorFillIcon width={16} height={16} /></span>
  {/if}

  {DeploymentStatuses[status] || status}
</div>


