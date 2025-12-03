<script lang="ts">
  import type { Function } from '@severlessworkflow/sdk-typescript/lib/definitions/function'
  import { onMount } from 'svelte'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import { goto } from '$app/navigation'

  import type { Maybe } from '$lib/types'
  import { getSpecByOperation, getToolByOperation } from '$lib/utils/tools'
  import type { DropDownOption } from '$lib/types/ui'
  import { getProvisionsBySchemasAction } from '$lib/stores/toolsStore'
  import { deployWorkflowAction } from '$lib/stores/workflowStore'
  import type { DeployOperation } from '$lib/types/workflows'
  import type { Configuration } from '$lib/types/tool'

  import Flyout from '$components/common/ui/Flyout.svelte'
  import { CloudArrowUp, CloudIcon } from '$components/icons'
  import Dropdown from '$components/common/ui/Dropdown.svelte'
  import ToolImage from '$components/common/ToolImage.svelte'
  import ModelDropdownOption from '$components/common/dropdown/ModelDropdownOption.svelte'
  import Modal from '$components/common/ui/Modal.svelte'
  import InfoIcon from '$components/icons/InfoIcon.svelte'
  import { Button } from '$components/common/ui'

  interface Props {
    projectId: string
    workflowId: string
    functions: Maybe<Specification.Functions>
    onClose: () => void
  }

  const EXCLUDED_TYPES = ['custom', 'expression']

  let {
    projectId,
    workflowId,
    functions,
    onClose
  }: Props = $props()

  const functionsList = typeof functions === 'object' ? functions : []

  let formFields: Array<Record<string, any>> = $state([])
  let configurations: Record<string, any> = $state({})
  let filteredFunctions = $state(functionsList.filter(({ type }) => !type || !EXCLUDED_TYPES.includes(type)))
  let isLoading = $state(false)
  let isModalOpen = $state(false)

  onMount(async () => {
    isLoading = true
    const schemas = new Set(filteredFunctions.map(({ operation }) => getSpecByOperation(operation).schema))
    const data = await getProvisionsBySchemasAction([...schemas].filter(Boolean))

    isLoading = false

    if (data) {
      configurations = data.reduce((prev: Record<string, any>, current) => {
        prev[current.schema] = current.values

        return prev
      }, {})
    }
  })

  const getOptions = (operation: string): DropDownOption[] => {
    const { schema } = getSpecByOperation(operation)

    return configurations[schema]?.map((item: Configuration) => {
      return {
        id: item.id,
        referenceId: item.referenceId,
        label: item.name,
        value: item.id,
        toolName: item.toolName,
        component: ModelDropdownOption
      }
    }) || []
  }

  const handleFormChange = (option: DropDownOption, index: number, tool: Function) => {
    if (!isNaN(index)) {
      formFields[index] = {
        ...tool,
        ...option,
        value: option.value
      }
    }
  }

  const handleDeploy = async () => {
    isLoading = true
    isModalOpen = true

    const data: DeployOperation[] = formFields.map((f) => ({
      name: f.name,
      operation: f.operation,
      configurationId: f.id,
      referenceId: f.referenceId
    }))

    const result = await deployWorkflowAction(projectId, workflowId, data)

    if (result) {
      onClose()
    } else {
      isLoading = false
      isModalOpen = false
    }
  }

  const isDisabled = () => isLoading || Boolean(filteredFunctions.length && formFields.filter(Boolean).length < filteredFunctions.length)
</script>

<Flyout
  isOpen
  onClose={onClose}
  className="w-[560px]"
>
  {#snippet header()}
    <div >
      <div class="flex items-center">
        <CloudArrowUp />
        <div class="ml-2 capitalize text-lg">Deploy</div>
      </div>
    </div>
  {/snippet}
  {#snippet body()}
    <div >
      <p class="text-sm">Select the credentials for your workflow tools from the list below.</p>
      <div class="mt-4"></div>
      {#if filteredFunctions}
        {#each filteredFunctions as tool, index (tool.name)}
          {#if typeof tool === 'object'}
            <div class="flex items-center justify-between p-2 border-strokeSoft200 gap-2">
              <div class="flex items-center max-w-[40%] basis-2/5 overflow-hidden">
                <span class="w-6 h-6 mr-2 toolImage shrink-0">
                   <ToolImage iconName={getToolByOperation(tool.operation)} />
                </span>
                <div class="text-[13px] capitalize overflow-ellipsis overflow-hidden">{tool.name}</div>
              </div>
              <div class="basis-3/5 shrink-0">
                <Dropdown
                  label="Account"
                  required
                  options={getOptions(tool.operation)}
                  plusOption={{ id: 'add-account', label: 'Create new Credentials', value: 'create' }}
                  onChange={(option) => handleFormChange(option, index, tool)}
                  onAdd={() => goto('/tool')}
                />
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {/snippet}
  {#snippet footer()}
    <div class="flex gap-2">
      <Button type="secondary" className="basis-full" onClick={onClose}>Cancel</Button>
      <Button
        className="basis-full"
        isDisabled={isDisabled()}
        {isLoading}
        onClick={handleDeploy}
        icon={CloudArrowUp}
      >
        Deploy
      </Button>
    </div>
  {/snippet}
</Flyout>

<Modal
  isOpen={isModalOpen}
  onClose={onClose}
  className="w-[440px]"
>
  {#snippet header()}
    <div class="flex items-center gap-2">
      <span class="p-2 bg-primaryAlpha16 text-primaryBase roundex-xs"><CloudIcon /></span>
      <h4 class="font-500">Deploying...</h4>
    </div>
  {/snippet}

  <div class="text-sm text-textSub600 ">
    Your workflow is being deployed and this operation could take some time, please close this modal and resume your work normally.
  </div>
  <div class="mt-6 p-2 bg-primaryAlpha16 rounded-sm text-textSub600 text-sm flex gap-2 items-center">
    <span class="text-primaryBase "><InfoIcon /></span>
    <span>Your workflow status is visible in the deployments page.</span>
  </div>

  {#snippet footer()}
    <Button type="secondary" className="grow-1" onClick={onClose}>Close</Button>
  {/snippet}
</Modal>

<style lang="postcss">
  .toolImage {
    :global(svg) {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
