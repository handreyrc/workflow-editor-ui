<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'
  import type { DropDownOption } from '$lib/types/ui'

  import { Dropdown } from '$components/common/ui'
  import FormField from '$components/common/FormField.svelte'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
    options: DropDownOption[]
  }

  let {
    form,
    options
  }: Props = $props()
</script>

{#if 'transition' in $form.values}
  <div class="mt-4">
    <Dropdown
      required={!$form.values.end}
      label="Transition"
      emptyText="No matching states"
      selected={options.find((option) => option.id === $form.values.transition)}
      options={options}
      onChange={(option) => {
        $form.change('transition', option.value)
        $form.change('end', false)
      }}
    />
  </div>
{/if}

{#if 'end' in $form.values}
  <div class="mt-4"></div>
  <FormField
    type="switch"
    name="end"
    label="Is End Node?"
    value={$form.values.end}
    onChange={({ name, value }) => {
      $form.change(name, value)
      if (value) $form.change('transition', '')
      $form.validate()
    }}
  />
{/if}
