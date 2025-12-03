<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Node } from '@xyflow/svelte'

  import { useForm } from '$lib/utils/hooks'

  import { Button, Flyout, Tooltip } from '$components/common/ui'
  import { ArrowLeft } from '$components/icons'
  import FormField from '$components/common/FormField.svelte'

  import { Actions, Timeouts } from './parts'
  import AddAction from './AddAction.svelte'

  interface Props {
    type: 'add' | 'edit'
    branch?: Specification.Branch
    onViewChange: (value?: string) => void
    functions?: Specification.Functions
    events?: Specification.Events
    subflows?: Specification.Workflow[]
    onSave: (branch: Specification.Branch) => void
  }

  const {
    type,
    branch,
    functions,
    events,
    subflows = [],
    onViewChange,
    onSave
  }: Props = $props()

  let view = $state('')
  let editAction = $state<Specification.Action>()

  const form = useForm({
    initialValues: {
      name: branch?.name ?? '',
      actions: branch?.actions || [],
      timeouts: {
        branchExecTimeout: branch?.timeouts?.branchExecTimeout || '',
      },
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}

      return errors
    },
  })

  const handleAddAction = (action: Specification.Action) => {
    view = ''
    if (editAction) {
      $form.change(
        'actions',
        $form.values.actions
          .map((a: Specification.Action) => a === editAction ? action : a)
      )
      return
    }

    $form.change('actions', [...$form.values.actions, action])
  }

  const handleSave = () => {
    const data = new Specification.Branch({
      ...$form.values,
    })

    onSave(data as Specification.Branch)
  }
</script>


{#if view === 'addAction'}
  <AddAction
    type={editAction ? 'edit' : 'add'}
    functions={functions}
    events={events}
    action={editAction}
    subflows={subflows}
    onViewChange={() => {
      view = ''
      editAction = undefined
    }}
    onSave={handleAddAction}
  />
{:else}
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
          <div class="capitalize text-lg">{type === 'edit' ? 'Edit' : 'Add'} Branch</div>
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

        <Timeouts form={form} />

         <Actions
           form={form}
           onViewChange={(_, item: Specification.Action) => {
             editAction = item
             view = 'addAction'
           }}
         />

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
{/if}
