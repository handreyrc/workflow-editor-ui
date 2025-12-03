<script lang="ts">
  import { useForm } from '$lib/utils/hooks'

  import Flyout from '$components/common/ui/Flyout.svelte'
  import FormField from '$components/common/FormField.svelte'
  import { SaveIcon, TrashIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  const MAX_DESCRIPTION_LENGTH = 200

  interface Props {
    type?: 'add' | 'edit'
    isOpen?: boolean
    isLoading?: boolean
    initialValues?: any
    onClose: () => void
    onDelete?: () => void
    onSave: (values: Record<string, any>) => void
  }

  let {
    type = 'add',
    isOpen = false,
    isLoading = false,
    initialValues = {
      name: '',
      key: '',
      description: '',
    },
    onClose,
    onDelete,
    onSave
  }: Props = $props()

  const form = useForm({
    initialValues: initialValues,
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Name is required'
      if (values.description.length > MAX_DESCRIPTION_LENGTH) errors.description = `Description should not exceed ${MAX_DESCRIPTION_LENGTH} characters.`
      if (!values.key) errors.key = 'Key is required'

      return errors
    }
  })

  const handleClickSave = () => {
    onSave($form.values)
  }
</script>

{#if isOpen}
  <Flyout
    isOpen
    onClose={onClose}
    className="w-[380px]"
  >
    {#snippet header()}
      <div  class="p-2">
        <div class="flex items-center">
          <div class="text-lg">{type === 'add' ? 'Add' : 'Edit'} Workflow</div>
        </div>
      </div>
    {/snippet}

    {#snippet body()}
      <div >
        <FormField
          name="key"
          label="ID"
          bind:value={$form.values.key}
          onChange={({ name, value }) => $form.change(name, value)}
          onBlur={(name) => $form.blur(name)}
          errorMessage={$form.touched.key ? $form.errors.key : ''}
          required
          placeholder="Enter ID"
        />

        <div class="mt-4"></div>
        <FormField
          name="name"
          label="Name"
          bind:value={$form.values.name}
          onChange={({ name, value }) => $form.change(name, value)}
          onBlur={(name) => $form.blur(name)}
          errorMessage={$form.touched.name ? $form.errors.name : ''}
          required
          placeholder="Enter name"
        />

        <div class="mt-4"></div>
        <FormField
          name="description"
          label="Description"
          bind:value={$form.values.description}
          onChange={({ name, value }) => $form.change(name, value)}
          onBlur={(name) => $form.blur(name)}
          errorMessage={$form.touched.description ? $form.errors.description : ''}
          type="textarea"
          placeholder="Enter description"
        />
      </div>
    {/snippet}

    {#snippet footer()}
      <div  class="flex justify-between gap-2">
        <Button type="secondary" className="basis-full" onClick={onClose}>Cancel</Button>
        {#if type === 'edit'}
          <Button
            className="basis-full"
            type="danger"
            onClick={() => onDelete?.()}
            icon={TrashIcon}
          >
            Delete
          </Button>
        {/if}
        <Button
          className="basis-full"
          onClick={handleClickSave}
          isDisabled={$form.status.isError || isLoading}
          {isLoading}
          icon={SaveIcon}
          iconSize={12}
        >
          Save
        </Button>
      </div>
    {/snippet}
  </Flyout>
{/if}
