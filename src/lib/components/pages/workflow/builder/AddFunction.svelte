<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import { onMount } from 'svelte'

  import { useForm } from '$lib/utils/hooks'
  import type { DropDownOption } from '$lib/types/ui'
  import { getToolsAction } from '$lib/stores/toolsStore'
  import { getSpecByOperation } from '$lib/utils/tools'
  import type { FormFieldChange } from '$lib/types/form'

  import FormField from '$components/common/FormField.svelte'
  import { Button, Dropdown } from '$components/common/ui'
  import { PlusIcon } from '$components/icons'
  import ModelDropdownOption from '$components/common/dropdown/ModelDropdownOption.svelte'

  const functionTypeOptions: DropDownOption[] = [
    { id: 'rest', value: 'rest', label: 'Rest' },
    { id: 'expression', value: 'expression', label: 'Expression' },
    { id: 'custom', value: 'custom', label: 'Custom' },
  ]

  interface Props {
    item: Specification.Function
    onSave: (values: Record<string, any>) => void
    onClose: () => void
  }

  let { item, onClose, onSave }: Props = $props()
  const schema = getSpecByOperation(item.operation || '')

  let isToolsLoading = $state(false)
  let toolOptions: DropDownOption[] = $state([])
  let selectedTool = $state<string>(schema.schema)
  let toolOperation = $state(schema.operation || '')

  onMount(async () => {
    isToolsLoading = true
    const toolsData = await getToolsAction({ page: 0, size: 100, type: 'tool'  })

    isToolsLoading = false

    toolOptions = toolsData.items
      .map((tool) => ({
        id: tool.id,
        value: tool.name,
        label: tool.name,
        toolName: tool.name,
        component: ModelDropdownOption
      }))
  })

  const form = useForm({
    initialValues: {
      name: item.name || '',
      type: item.type || 'rest',
      operation: item.operation || '',
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Function name is required'

      if (values.type === 'rest' && !selectedTool) {
        errors.tool = 'Tool selection is required for REST functions'
      }

      return errors
    },
  })

  const handleChangeOperation = ({ value }: FormFieldChange) => {
    if (typeof value === 'string') {
      toolOperation = (!value || value?.startsWith?.('#')) ? value : `#${value}`
    }
  }

  const handleSave = () => {
    if ($form.status.isError) return

    const values = $form.values
    const operation = values.type === 'rest' ? `${selectedTool}${toolOperation}` : values.operation

    onSave({
      name: values.name,
      type: values.type,
      operation,
    })
  }
</script>

<FormField
  required
  name="name"
  label="Function Name"
  bind:value={$form.values.name}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  placeholder="Enter name"
/>

<div class="mt-4"></div>
<Dropdown
  label="Type"
  selected={functionTypeOptions.find((option) => option.value === $form.values.type)}
  options={functionTypeOptions}
  onChange={(option) => {
    $form.change('type', option.value)
  }}
/>

<div class="mt-4"></div>
{#if $form.values.type === 'expression'}
  <FormField
    name="operation"
    label="Expression"
    bind:value={$form.values.operation}
    onChange={({ name, value }) => $form.change(name, value)}
    onBlur={(name) => $form.blur(name)}
    placeholder="Enter expression"
  />
{/if}

{#if $form.values.type === 'rest'}
  <Dropdown
    required
    label="Tool"
    disabled={isToolsLoading}
    selected={toolOptions.find((option) => option.value === selectedTool)}
    options={toolOptions}
    onChange={(option) => {
      selectedTool = option.value
      $form.validate()
    }}
  />

  <div class="mt-4"></div>
  <FormField
    name="operation"
    label="Operation"
    bind:value={toolOperation}
    onChange={handleChangeOperation}
    placeholder="Enter operation (e.g., #postMessage)"
  />
{/if}

<div class="flex justify-end gap-2 mt-4">
  <Button size="small" type="secondary" onClick={onClose}>Cancel</Button>
  <Button
    size="small"
    onClick={handleSave}
    isDisabled={$form.status.isError}
    icon={PlusIcon}
    iconSize={12}
  >
    Add
  </Button>
</div>
