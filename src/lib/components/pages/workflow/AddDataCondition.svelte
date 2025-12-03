<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Node } from '@xyflow/svelte'

  import { useForm } from '$lib/utils/hooks'
  import { isValidJSONObject } from '$lib/utils/workflow/validators'
  import type { DropDownOption } from '$lib/types/ui'
  import type { FlowNode } from '$lib/types/flow'

  import { Button, Dropdown, Flyout, Tooltip } from '$components/common/ui'
  import { ArrowLeft } from '$components/icons'
  import FormField from '$components/common/FormField.svelte'
  import MonacoEditor from '$components/common/MonacoEditor.svelte'

  interface Props {
    type: 'add' | 'edit'
    condition?: Specification.Datacondition
    onViewChange: (value?: string) => void
    nodes: Node[]
    onSave: (action: Specification.Datacondition) => void
  }

  const {
    type,
    condition,
    nodes,
    onViewChange,
    onSave
  }: Props = $props()

  const form = useForm({
    initialValues: {
      name: condition?.name ?? '',
      condition: condition?.condition ?? '',
      metadata: condition?.metadata ? JSON.stringify(condition.metadata, null, 2) : '',
      transition: condition?.transition ?? '',
      end: condition?.end,
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.condition) {
        errors.condition = 'Condition is required'
      }

      if (!values.end && !values.transition) {
        errors.transition = 'Transition is required'
      }

      if (values.metadata && !isValidJSONObject(values.metadata)) {
        errors.metadata = 'Metadata must be a valid JSON object'
      }

      return errors
    },
  })

  const getTransitionOptions = (): DropDownOption[] => {
    return (nodes as FlowNode[])
      .map(({ data }) => ({
        id: data.state.name,
        label: data.state.name,
        value: data.state.name,
      } as DropDownOption)) || []
  }

  const handleSave = () => {
    const data = new Specification.Transitiondatacondition({
      ...$form.values,
      end: $form.values.end || undefined,
      metadata: $form.values.metadata ? JSON.parse($form.values.metadata) : undefined
    })

    onSave(data as Specification.Datacondition)
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
        <div class="capitalize text-lg">{type === 'edit' ? 'Edit' : 'Add'} Data Condition</div>
      </div>
    </div>
  {/snippet}

  {#snippet body()}
    <div class="form">
      <FormField
        name="name"
        label="Name"
        bind:value={$form.values.name}
        onChange={({ name, value }) => $form.change(name, value)}
        onBlur={(name) => $form.blur(name)}
        placeholder="Enter name"
        errorMessage={$form.touched.name ? $form.errors.name : ''}
      />

      <div class="mt-4"></div>
      <FormField
        required
        name="condition"
        label="Condition"
        tooltip="	Workflow expression evaluated against state data. Must evaluate to true or false"
        bind:value={$form.values.condition}
        onChange={({ name, value }) => $form.change(name, value)}
        placeholder="Enter Condition"
      />

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
          label="Is End Node?"
          value={$form.values.end}
          onChange={({ name, value }) => {
            $form.change(name, value)
            if (value) $form.change('transition', '')
            $form.validate()
          }}
        />
      {/if}

      <div class="mt-4"></div>
      <h4 class="text-sm font-500">Metadata</h4>
      <div class="w-full h-40 border border-strokeSub300 mt-2">
        <MonacoEditor
          value={$form.values.metadata}
          onChange={(val) => {
            $form.change('metadata', val)
            $form.validate()
          }}
          options={{ minimap: { enabled: false } }}
        />
      </div>

    </div>
  {/snippet}

  {#snippet footer()}
    <div class="flex justify-between gap-2">
      <Button type="secondary" className="basis-1/2" onClick={() => onViewChange()}>Cancel</Button>

      <Tooltip
        className="basis-1/2"
        content={$form.status.isError ? 'Error' : ''}
      >
        {#snippet tooltip()}
          {@const errors = Object.values($form?.errors || {}).filter(Boolean)}
          {#each errors as error, index (index)}
            <div class="text-xs">- {error}</div>
          {/each}
        {/snippet}
        <Button
          className="grow"
          onClick={handleSave}
          isDisabled={$form.status.isError}
        >
          {type === 'add' ? 'Add' : 'Save'}
        </Button>
      </Tooltip>
    </div>
  {/snippet}
</Flyout>
