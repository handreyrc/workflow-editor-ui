<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Node } from '@xyflow/svelte'

  import type { DropDownOption } from '$lib/types/ui'
  import { type UseForm } from '$lib/utils/hooks/useForm'
  import type { FlowNode } from '$lib/types/flow'
  import type { WorkflowForm } from '$lib/types/forms/workflow'

  import { Dropdown, TagsInput } from '$components/common/ui'
  import FormField from '$components/common/FormField.svelte'
  import MonacoEditor from '$components/common/MonacoEditor.svelte'

  interface Props {
    nodes: Node[]
    form: Writable<UseForm<WorkflowForm>>
    isIdDisabled?: boolean
  }

  let { nodes, form, isIdDisabled }: Props = $props()

  const startOptions: DropDownOption[] = nodes
    ?.map((node: Node) => {
      const name = (node as FlowNode).data.state?.name || ''
      return {
        id: name,
        label: name,
        value: name
      }
    }) || []
</script>

<FormField
  disabled
  name="version"
  label="Version"
  value={$form.values.version}
  onChange={({ name, value }) => $form.change(name, value)}
  placeholder="0.0.8"
  errorMessage={$form.touched.version ? $form.errors.version : ''}
/>

<div class="flex gap-2 mt-4">
  <FormField
    name="id"
    label="ID"
    tooltip="Unique identifier for the workflow"
    value={$form.values.id}
    onChange={({ name, value }) => $form.change(name, value)}
    onBlur={(name) => $form.blur(name)}
    placeholder="Enter ID"
    disabled={isIdDisabled}
  />
  <FormField
    name="key"
    label="Key"
    tooltip="Unique business key for the workflow"
    value={$form.values.key}
    onChange={({ name, value }) => $form.change(name, value)}
    onBlur={(name) => $form.blur(name)}
    placeholder="Enter key"
  />
</div>

<div class="mt-4"></div>
<FormField
  name="name"
  label="Workflow Name"
  value={$form.values.name}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  placeholder="Enter name"
  errorMessage={$form.touched.name ? $form.errors.name : ''}
/>

<div class="mt-4"></div>
<FormField
  type="textarea"
  name="description"
  label="Description"
  value={$form.values.description}
  onChange={({ name, value }) => $form.change(name, value)}
  placeholder="Enter description"
  className="min-h-20"
/>

<div class="mt-4"></div>
<TagsInput
  name="annotations"
  label="Annotations (&quot;Enter&quot; to add)"
  value={$form.values.annotations}
  onChange={(value) => $form.change('annotations', value)}
  placeholder="Enter annotations"
  errorMessage={$form.touched.annotations ? $form.errors.annotations : ''}
/>


<div class="mt-4">
  <Dropdown
    label="Start"
    emptyText="No matching states"
    selected={startOptions.find((option) => option.id === $form.values.start)}
    options={startOptions}
    onChange={(option) => {
      $form.change('start', option.value)
    }}
  />
</div>

<div class="mt-4"></div>
<span class="text-xs">Data Input Schema</span>
<div class="w-full h-32 border border-strokeSub300 mt-1">
  <MonacoEditor
    value={$form.values.dataInputSchema}
    onChange={(val) => {
      $form.change('dataInputSchema', val)
      $form.validate()
    }}
    options={{ minimap: { enabled: false }, }}
  />
</div>

<div class="mt-4"></div>
<span class="text-xs">Constants</span>
<div class="w-full h-32 border border-strokeSub300 mt-1">
  <MonacoEditor
    value={$form.values.constants}
    onChange={(val) => {
      $form.change('constants', val)
      $form.validate()
    }}
    options={{ minimap: { enabled: false }, }}
  />
</div>

<div class="mt-4"></div>
<span class="text-xs">Metadata</span>
<div class="w-full h-32 border border-strokeSub300 mt-1">
  <MonacoEditor
    value={$form.values.metadata}
    onChange={(val) => {
      $form.change('metadata', val)
      $form.validate()
    }}
    options={{ minimap: { enabled: false } }}
  />
</div>

{#if typeof $form.values.timeouts === 'object'}
  {#if typeof $form.values.timeouts.workflowExecTimeout !== 'object'}
    <div class="mt-4"></div>
    <FormField
      name="timeouts.workflowExecTimeout"
      label="Workflow Execution Timeout"
      value={$form.values.timeouts.workflowExecTimeout}
      onChange={({ name, value }) => $form.change(name, value)}
      onBlur={(name) => $form.blur(name)}
      placeholder="Enter timeout (e.g., PT1H)"
      errorMessage={$form.touched['timeouts.workflowExecTimeout'] ? $form.errors['timeouts.workflowExecTimeout'] : ''}
    />
  {/if}

  <div class="mt-4"></div>
  <FormField
    name="timeouts.eventTimeout"
    label="Event Timeout"
    value={$form.values.timeouts.eventTimeout}
    onChange={({ name, value }) => $form.change(name, value)}
    onBlur={(name) => $form.blur(name)}
    placeholder="Enter timeout (e.g., PT1H)"
    errorMessage={$form.touched['timeouts.eventTimeout'] ? $form.errors['timeouts.eventTimeout'] : ''}
  />
{/if}

