<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import FormField from '$components/common/FormField.svelte'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
  }

  let {
    form,
  }: Props = $props()
</script>

{#if 'eventTimeout' in $form.values.timeouts}
  <div class="mt-4"></div>
  <FormField
    name="timeouts.eventTimeout"
    label="Event Timeout"
    value={$form.values.timeouts.eventTimeout}
    onBlur={(name) => $form.blur(name)}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Timeout"
    errorMessage={$form.touched['timeouts.eventTimeout'] ? $form.errors['timeouts.eventTimeout'] : ''}
  />
{/if}

{#if 'stateExecTimeout' in $form.values.timeouts}
  <div class="mt-4"></div>
  <FormField
    name="timeouts.stateExecTimeout"
    label="State Exec Timeout"
    value={$form.values.timeouts.stateExecTimeout}
    onBlur={(name) => $form.blur(name)}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Timeout"
    errorMessage={$form.touched['timeouts.stateExecTimeout'] ? $form.errors['timeouts.stateExecTimeout'] : ''}
  />
{/if}

{#if 'branchExecTimeout' in $form.values.timeouts}
  <div class="mt-4"></div>
  <FormField
    name="timeouts.branchExecTimeout"
    label="Branch Exec Timeout"
    value={$form.values.timeouts.branchExecTimeout}
    onBlur={(name) => $form.blur(name)}
    onChange={({ name, value }) => $form.change(name, value)}
    placeholder="Enter Timeout"
    errorMessage={$form.touched['timeouts.branchExecTimeout'] ? $form.errors['timeouts.branchExecTimeout'] : ''}
  />
{/if}
