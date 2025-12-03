<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Node } from '@xyflow/svelte'

  import { useForm } from '$lib/utils/hooks'
  import { addNewError } from '$lib/utils/flow'
  import type { DropDownOption } from '$lib/types/ui'
  import type { FlowNode } from '$lib/types/flow'

  import { Button, Flyout, Dropdown } from '$components/common/ui'
  import { ArrowLeft, SaveIcon } from '$components/icons'
  import FormField from '$components/common/FormField.svelte'

  interface Props {
    type: 'add' | 'edit'
    allNodes: Node[]
    error?: Specification.Error
    errors?: Specification.Errors
    onViewChange: (value?: string) => void
    onSave: (error: Specification.Error) => void
  }

  const {
    type,
    error,
    errors,
    allNodes,
    onViewChange,
    onSave
  }: Props = $props()

  const form = useForm({
    initialValues: {
      errorRef: '',
      transition: '',
      ...(error || {}),
      end: Boolean(error?.end),
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.errorRef) errors.errorRef = 'Error reference is required'
      if (!values.end && !values.transition) {
        errors.transition = 'Transition is required'
      }

      return errors
    },
  })

  const getTransitionOptions = (): DropDownOption[] => {
    return (allNodes as FlowNode[])
      .filter(({ data }) => !data.state.usedForCompensation)
      .map(({ data }) => ({
        id: data.state.name,
        label: data.state.name,
        value: data.state.name,
      } as DropDownOption)) || []
  }

  const getErrorOptions = (): DropDownOption[] => {
    if (typeof errors === 'string') {
      return []
    }

    return errors?.map((error) => ({
      id: error.name,
      label: error.name,
      value: error.name,
    })) || []
  }

  const handleSave = () => {
    onSave(addNewError($form.values))
  }
</script>

<Flyout
  isOpen
  overlay={false}
  onClose={() => onViewChange()}
  className="absolute! top-4! right-4! bottom-4! h-auto! rounded-xl max-w-[480px]"
>
  {#snippet header()}
    <div class="flex gap-2 items-center">
      <Button className="text-textSub600" type="empty" onClick={() => onViewChange()} icon={ArrowLeft} iconSize={14} />
      <div>
        <div class="capitalize text-lg">{type === 'edit' ? 'Edit' : 'Add'} Error</div>
      </div>
    </div>
  {/snippet}

  {#snippet body()}
    <div class="form">
      {#if typeof errors !== 'string'}
        {@const errorOptions = getErrorOptions()}
        <Dropdown
          required
          label="Error Reference"
          emptyText="No matching errors"
          selected={errorOptions.find((option) => option.id === $form.values.errorRef)}
          options={errorOptions}
          onChange={(option) => {
            $form.change('errorRef', option.value)
          }}
        />
      {/if}

      <div class="mt-4"></div>
      {#if 'transition' in $form.values}
        {@const options = getTransitionOptions()}
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
          label="Transition to end"
          value={$form.values.end}
          onChange={({ name, value }) => {
            $form.change(name, value)
            if (value) $form.change('transition', '')
            $form.validate()
          }}
        />
      {/if}
    </div>
  {/snippet}

  {#snippet footer()}
    <div class="flex justify-between gap-2">
      <Button type="secondary" className="basis-full" onClick={() => onViewChange()}>Cancel</Button>
      <Button
        className="basis-full"
        onClick={handleSave}
        isDisabled={$form.status.isError}
      >
        {type === 'add' ? 'Add' : 'Save'}
      </Button>
    </div>
  {/snippet}
</Flyout>
