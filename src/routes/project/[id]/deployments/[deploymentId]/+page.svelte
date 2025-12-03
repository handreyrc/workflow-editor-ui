<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import { format } from 'date-fns'

  import { page } from '$app/state'
  import { goto } from '$app/navigation'

  import { selectedProjectSelector } from '$lib/stores/projectsStore'
  import {
    getDeploymentAction,
    getDeploymentExecutionsActions,
    selectedDeploymentSelector,
    setSelectedDeployment
  } from '$lib/stores/deploymentsStore'
  import type { Maybe } from '$lib/types'
  import { type Deployment, DeploymentStatus } from '$lib/types/deployment'
  import type { Column } from '$lib/types/table'

  import { Breadcrumbs, PageHeader } from '$components/header'
  import { PlayIcon } from '$components/icons'
  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import { DeploymentStatus as DeploymentStatusComponent } from '$components/pages/deployments'
  import { Button, Tooltip } from '$components/common/ui'
  import Table from '$components/common/table/Table.svelte'

  import ExecutionStatusCell from './ExecutionStatusCell.svelte'
  import ExecutionPanel from './ExecutionPanel.svelte'

  const INTERVAL_TO_REFRESH = 5_000

  const columns: Column<any>[] = [
    { key: 'id', label: 'ID', isSorting: true, className: 'truncate max-w-[20vw]' },
    { key: 'rootProcessId', label: 'Execution ID', isSorting: true },
    { key: 'processId', label: 'Workflow ID', isSorting: true },
    { key: 'state', label: 'State', component: ExecutionStatusCell, isSorting: false },
    { key: 'lastUpdate', label: 'Last Update', isSorting: false, render: (value: string) => format(value, 'HH:mm MM.dd.yyyy') },
  ]

  let projectId = page.params?.id
  let deploymentId = page.params?.deploymentId

  let isPageLoading = $state(true)
  let isLoading = $state(false)
  let intervalId: Maybe<ReturnType<typeof setTimeout>> = $state()
  let executions = $state([])
  let isExecutePanel = $state(false)

  const deployment = derived(selectedDeploymentSelector, (d) => d)
  const isStatusCompleted = (deployment: Deployment) => {
    return deployment?.status === DeploymentStatus.READY
      || deployment?.status === DeploymentStatus.DEPLOY_FAILED
      || deployment?.status === DeploymentStatus.BUILD_FAILED
  }

  onMount(async () => {
    const data = await getDeploymentAction(projectId, deploymentId)
    isPageLoading = false

    fetchExecutions()

    if (data && isStatusCompleted(data)) {
      return
    }

    intervalId = setInterval(async () => {
      const data = await getDeploymentAction(projectId, deploymentId)

      if (data && isStatusCompleted(data)) {
        clearInterval(intervalId)
      }
    }, INTERVAL_TO_REFRESH)
  })

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }

    setSelectedDeployment(null)
  })

  const fetchExecutions = async () => {
    const { ProcessInstances } = await getDeploymentExecutionsActions({
      processId: $deployment?.executionPath
    })

    if (ProcessInstances) {
      executions = ProcessInstances
    }
  }

  const onClickEditWorkflow = () => {
    if ($deployment?.workflowId) {
      goto(`/project/${projectId}/workflows/${$deployment.workflowId}`)
    }
  }
</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <div class="flex items-center">
      <Breadcrumbs
        breadcrumbs={[
          { link: '/project', title: 'Projects' },
          { link: `/project/${$selectedProjectSelector?.id || ''}/deployments`, title: $selectedProjectSelector?.name || '' },
          { link: '', title: $deployment?.workflowName || '' },
        ]}
      />
      <div class="ml-2">
        <DeploymentStatusComponent status={$deployment?.status} />
      </div>
    </div>
  {/snippet}
  {#snippet content()}
    <div class="flex gap-4">
      <Button
        fill={false}
        type="danger"
        size="small"
        onClick={() => {}}
        isDisabled={true || isLoading}
      >
        Undeploy
      </Button>
      <Tooltip
        content={!$deployment || $deployment?.status !== DeploymentStatus.READY
          ? 'Run will be available only when the deployment is ready'
          : undefined}
      >
        <Button
          size="small"
          onClick={() => {
            isExecutePanel = true
          }}
          icon={PlayIcon}
          isLoading={isLoading}
          isDisabled={$deployment?.status !== DeploymentStatus.READY || isLoading}
        >
          Run
        </Button>
      </Tooltip>

    </div>
  {/snippet}
</PageHeader>

<div class="grow p-4 flex flex-col">
  {#if isPageLoading}
    <GlobalLoader internalLoader />
  {:else}
    <div class="bg-bgSection rounded-md border border-strokeSoft200">
      <div class="flex justify-between items-center p-4">
        <h4>Workflow Details</h4>

        <Button
          type="empty"
          className="border border-strokeSoft200 py-1.5 px-2 text-sm text-textSub600 bg-bgWhite0"
          onClick={onClickEditWorkflow}
        >
          Edit Workflow
        </Button>
      </div>
      <div class="border-b border-b-strokeSoft200 mx-4"></div>
      <div class="grid grid-cols-3">
        <div class="border-r border-r-strokeSoft200 p-4">
          <div class="uppercase text-[11px] text-textSoft400 mb-2">Workflow ID</div>
          <span class="text-xs">{$deployment?.workflowId || ''}</span>
        </div>

        <div class="border-r border-r-strokeSoft200 p-4">
          <div class="uppercase text-[11px] text-textSoft400 mb-2">Version</div>
          <span class="text-xs">{$deployment?.workflowVersion || ''}</span>
        </div>

        <div class="p-4">
          <div class="uppercase text-[11px] text-textSoft400 mb-2">Deployment URL</div>
          {#if $deployment?.url}
            <a href={$deployment?.url} target="_blank" class="text-xs underline hover:no-underline">URL</a>
          {:else}
            <span class="text-textSoft400 text-xs">Not available</span>
          {/if}
        </div>
      </div>
    </div>

    <div class="mt-12"></div>
    <Table
      {columns}
      data={executions}
      initialSortKey="deploymentId"
      initialSortAsc={true}
      pageSize={10}
      onRowClick={() => {}}
    />
  {/if}
</div>

{#if isExecutePanel && $deployment}
  <ExecutionPanel
    deployment={$deployment}
    onClose={() => {
      fetchExecutions()
      isExecutePanel = false
    }}
  />
{/if}

