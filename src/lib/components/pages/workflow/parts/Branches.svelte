<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import { Button } from '$components/common/ui'
  import EditableList from '$components/common/EditableList.svelte'
  import { getActionRefName } from '$components/pages/workflow/utils'
  import { PlusIcon } from '$components/icons'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
    onViewChange: (value: string, item?: any) => void
  }

  let {
    form,
    onViewChange
  }: Props = $props()
</script>

{#if $form.values.branches?.length}
  <div class="mt-4">
    <EditableList
      items={$form.values.branches}
      onEdit={(item) => onViewChange('addBranch', item)}
      onDelete={(item) => {
        $form.change('branches', $form.values.branches.filter((i) => i !== item))
        $form.validate()
      }}
      getName={(item: Specification.Action) => item.name ?? `ref: ${getActionRefName(item)}`}
    />
    <div class="flex justify-end">
      <Button
        className="text-textSub600"
        type="empty"
        icon={PlusIcon}
        onClick={() => onViewChange('addBranch')}
      >Add Action</Button>
    </div>
  </div>
{:else}
  <div class="mt-4 flex flex-col items-center justify-center">
    <img src={EmptyActionsImg} alt="" />
    <div class="text-sm font-bold mt-4 mb-4">No branches defined yet</div>
    <Button
      size="small"
      onClick={() => onViewChange('addBranch')}
      icon={PlusIcon}
    >
      Add Branch
    </Button>
  </div>
{/if}
