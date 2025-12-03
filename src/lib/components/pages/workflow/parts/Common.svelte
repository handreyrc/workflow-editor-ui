<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import { completionTypeOptions } from '$components/pages/workflow/constants'
  import FormField from '$components/common/FormField.svelte'
  import { Dropdown } from '$components/common/ui'


  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
  }

  let {
    form,
  }: Props = $props()
</script>

<FormField
  name="name"
  label="Name"
  value={$form.values.name}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  required
  placeholder="Enter name"
  errorMessage={$form.touched.name ? $form.errors.name : ''}
/>

<div class="mt-4"></div>
<FormField
  name="id"
  label="ID"
  tooltip="Unique identifier for the state"
  value={$form.values.id}
  onChange={({ name, value }) => $form.change(name, value)}
  placeholder="Enter ID"
/>

{#if 'duration' in $form.values}
  <div class="mt-4"></div>
  <FormField
    name="duration"
    label="Duration"
    tooltip="Duration (ISO 8601 duration format) to sleep. For example: &quot;PT15M&quot; (sleep 15 minutes), or &quot;P2DT3H4M&quot; (sleep 2 days, 3 hours and 4 minutes)"
    value={$form.values.duration}
    onChange={({ name, value }) => $form.change(name, value)}
    onBlur={(name) => $form.blur(name)}
    placeholder="Enter Duration"
    errorMessage={$form.touched.duration ? $form.errors.duration : ''}
  />
{/if}

{#if 'completionType' in $form.values}
  <div class="mt-4"></div>
  <Dropdown
    label="Completion Type"
    selected={completionTypeOptions.find((option) => option.value === $form.values.completionType)}
    options={completionTypeOptions}
    onChange={(option) => {
      $form.change('completionType', option.value)
    }}
  />
{/if}

{#if 'numCompleted' in $form.values}
  <div class="mt-4"></div>
  <FormField
    name="numCompleted"
    label="Num Completed"
    tooltip="Used when branchCompletionType is set to atLeast to specify the least number of branches that must complete in order for the state to transition/end."
    value={$form.values.numCompleted}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Num Completed"
  />
{/if}

{#if 'exclusive' in $form.values}
  <div class="mt-4"></div>
  <FormField
    type="switch"
    name="exclusive"
    label="Exclusive"
    value={$form.values.exclusive}
    onChange={({ name, value }) => {
      $form.change(name, value)
      $form.validate()
    }}
  />
{/if}

{#if 'inputCollection' in $form.values}
  <div class="mt-4"></div>
  <FormField
    required
    name="inputCollection"
    label="Input Collection"
    value={$form.values.inputCollection}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Input Collection"
  />
{/if}

{#if 'outputCollection' in $form.values}
  <div class="mt-4"></div>
  <FormField
    name="outputCollection"
    label="Output Collection"
    value={$form.values.outputCollection}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Output Collection"
  />
{/if}

{#if 'iterationParam' in $form.values}
  <div class="mt-4"></div>
  <FormField
    name="iterationParam"
    label="Iteration Param"
    value={$form.values.iterationParam}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Iteration Param"
  />
{/if}

{#if 'batchSize' in $form.values}
  <div class="mt-4"></div>
  <FormField
    name="batchSize"
    label="Batch Size"
    value={$form.values.batchSize}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Batch Size"
  />
{/if}
