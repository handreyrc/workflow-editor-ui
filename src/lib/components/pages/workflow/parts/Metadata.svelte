<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import MonacoEditor from '$components/common/MonacoEditor.svelte'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
  }

  let {
    form,
  }: Props = $props()
</script>

<div class="w-full h-40 border border-strokeSub300 mt-4">
  <MonacoEditor
    value={$form.values.metadata}
    onChange={(val) => {
      $form.change('metadata', val)
      $form.validate()
    }}
    options={{ minimap: { enabled: false } }}
  />
</div>
