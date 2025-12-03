<script lang="ts">
  import { useForm } from '$lib/utils/hooks'

  import Flyout from '$components/common/ui/Flyout.svelte'
  import { SaveIcon, TrashIcon } from '$components/icons'
  import FormField from '$components/common/FormField.svelte'
  import { Button } from '$components/common/ui'

  interface Props {
    type?: 'add' | 'edit'
    initialValues?: {
      name: string
      description: string
    }
    isLoading?: boolean
    onClose: () => void
    onDelete?: () => void
    onSave: (form: {
      name: string
      description: string
    }) => void
  }

  let {
    type = 'add',
    initialValues = {
      name: '',
      description: ''
    },
    isLoading = false,
    onClose,
    onDelete,
    onSave
  }: Props = $props()

  const form = useForm({
    initialValues,
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Name is required'
      if (!values.description) errors.description = 'Description is required'

      return errors
    }
  })
</script>

<Flyout
  isOpen
  onClose={onClose}
  className="w-[380px]"
>
  {#snippet header()}
    <div  class="p-2">
      <div class="flex items-center">
        <div class="text-lg">{type === 'add' ? 'Add' : 'Edit'} Project</div>
      </div>
    </div>
  {/snippet}

  {#snippet body()}
    <div >
      <FormField
        name="name"
        label="Name"
        bind:value={$form.values.name}
        onChange={({ name, value }) => $form.change(name, value)}
        onBlur={(name) => $form.blur(name)}
        required
        placeholder="Enter name"
        errorMessage={$form.touched.name ? $form.errors.name : ''}
      />
      <div class="mt-4"></div>

      <FormField
        name="description"
        label="Description"
        bind:value={$form.values.description}
        onChange={({ name, value }) => $form.change(name, value)}
        onBlur={(name) => $form.blur(name)}
        required
        type="textarea"
        placeholder="Enter description"
        errorMessage={$form.touched.description ? $form.errors.description : ''}
      />
    </div>
  {/snippet}
  {#snippet footer()}
    <div class="flex justify-between gap-2">
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
        onClick={() => onSave($form.values)}
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
