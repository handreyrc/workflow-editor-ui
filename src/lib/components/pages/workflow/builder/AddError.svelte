<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import { useForm } from '$lib/utils/hooks'

  import FormField from '$components/common/FormField.svelte'
  import { Button } from '$components/common/ui'
  import { PlusIcon } from '$components/icons'

  interface Props {
    item: Specification.Errordef
    onSave: (values: Record<string, any>) => void
    onClose: () => void
  }

  let { item, onClose, onSave }: Props = $props()

  const form = useForm({
    initialValues: {
      name: item.name || '',
      code: item.code || '',
      description: item.description || '',
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Error name is required'

      return errors
    },
  })

  const handleSave = () => {
    if ($form.status.isError) return

    onSave($form.values)
  }
</script>

<FormField
  required
  name="name"
  label="Error Name"
  bind:value={$form.values.name}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  placeholder="Enter name"
/>

<div class="mt-4"></div>
<FormField
  name="code"
  label="Error Code"
  bind:value={$form.values.code}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  placeholder="Enter error code"
/>

<div class="mt-4"></div>
<FormField
  type="textarea"
  name="description"
  label="Description"
  bind:value={$form.values.description}
  onChange={({ name, value }) => $form.change(name, value)}
  onBlur={(name) => $form.blur(name)}
  placeholder="Enter description"
/>

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
