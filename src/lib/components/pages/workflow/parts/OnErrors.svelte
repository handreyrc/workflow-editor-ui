<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'

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

{#if $form.values.onErrors?.length}
  <div class="mt-4">
    <EditableList
      items={$form.values.onErrors}
      onEdit={(item) => onViewChange('addError', item)}
      onDelete={(item) => {
        $form.change('onErrors', $form.values.onErrors.filter((i) => i !== item))
        $form.validate()
      }}
      getName={(item: Specification.Error) => item?.errorRef}
    />
    <div class="flex justify-end">
      <Button
        className="text-textSub600"
        type="empty"
        icon={PlusIcon}
        onClick={() => onViewChange('addError')}
      >Add Error</Button>
    </div>
  </div>
{:else}
  <div class="mt-4 flex flex-col items-center justify-center">
    <img src={EmptyActionsImg} alt="" />
    <div class="text-sm font-bold mt-4 mb-4">No errors defined yet</div>
    <Button
      size="small"
      onClick={() => onViewChange('addError')}
      icon={PlusIcon}
    >
      Add Error
    </Button>
  </div>
{/if}
