<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'
  import type { DropDownOption } from '$lib/types/ui'

  import FormField from '$components/common/FormField.svelte'
  import { Dropdown } from '$components/common/ui'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
    options: DropDownOption[]
  }

  let {
    form,
    options
  }: Props = $props()
</script>

<div class="mt-4">
  <Dropdown
    label="Compensated By"
    emptyText="No matching states"
    selected={options.find((option) => option.id === $form.values.compensatedBy)}
    options={options}
    onChange={(option) => { $form.change('compensatedBy', option.value) }}
  />
</div>

{#if 'usedForCompensation' in $form.values}
  <div class="mt-4"></div>
  <FormField
    type="switch"
    name="usedForCompensation"
    label="Used for Compensation"
    value={$form.values.usedForCompensation}
    onChange={({ name, value }) => {
      $form.change(name, value)
      if (value) $form.change('compensatedBy', '')
      $form.validate()
    }}
  />
{/if}
