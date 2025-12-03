<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import { getActionRefName } from '$components/pages/workflow/utils'
  import { PlusIcon } from '$components/icons'
  import EditableList from '$components/common/EditableList.svelte'
  import { Button } from '$components/common/ui'

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

{#if $form.values.action}
  <div class="mt-4">
    <EditableList
      items={[$form.values.action]}
      onEdit={(item) => onViewChange('addAction', item)}
      onDelete={(item) => {
        $form.change('action', undefined)
        $form.validate()
      }}
      getName={(item: Specification.Action) => item.name ?? `ref: ${getActionRefName(item)}`}
    />
  </div>
{:else}
  <div class="mt-4 flex flex-col items-center justify-center">
    <img src={EmptyActionsImg} alt="" />
    <div class="text-sm font-bold mt-4 mb-4">No action defined yet</div>
    <Button
      size="small"
      onClick={() => onViewChange('addAction')}
      icon={PlusIcon}
    >
      Add Action
    </Button>
  </div>
{/if}
