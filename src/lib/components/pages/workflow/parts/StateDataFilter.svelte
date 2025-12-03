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

<div class="mt-4"></div>
<FormField
  name="stateDataFilter.input"
  label="Input"
  value={$form.values.stateDataFilter.input}
  onBlur={(name) =>{
    $form.blur(name)
  }}
  onChange={({ name, value }) => $form.change(name, value)}
  placeholder="Enter State Data Filter Input"
  errorMessage={$form.touched['stateDataFilter.input'] ? $form.errors['stateDataFilter.input'] : ''}
/>

<div class="mt-4"></div>
<FormField
  name="stateDataFilter.output"
  label="Output"
  value={$form.values.stateDataFilter.output}
  onChange={({ name, value }) => $form.change(name, value)}
  placeholder="Enter State Data Filter Output"
/>
