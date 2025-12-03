<script lang="ts">
  import type { Deployment } from '$lib/types/deployment'
  import { executeDeploymentAction } from '$lib/stores/deploymentsStore'
  import { useForm } from '$lib/utils/hooks'

  import { Button, Flyout } from '$components/common/ui'
  import { CloudArrowUp } from '$components/icons'
  import MonacoEditor from '$components/common/MonacoEditor.svelte'
  import CodeBlock from '$components/parser/CodeBlock.svelte'


  interface Props {
    deployment: Deployment
    onClose: () => void
  }

  let { deployment, onClose }: Props = $props()
  let isLoading = $state(false)
  let result = $state<Record<string, any>>()

  const form = useForm({
    initialValues: {
      value: ''
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (values.value) {
        try {
          JSON.parse(values.value)
        } catch (e) {
          errors.value = 'Invalid JSON format'
        }
      }

      return errors
    }
  })

  const onExecute = async () => {
    const url = deployment?.url
    if (!url) return

    isLoading = true

    const val = JSON.parse($form.values.value || '{}')
    const data = await executeDeploymentAction(url, deployment?.executionPath, val)

    isLoading = false

    if (data) {
      result = data
    }
  }
</script>

<Flyout
  isOpen
  onClose={onClose}
  className="w-[560px]"
>
  {#snippet header()}
    <div class="flex items-center">
      <CloudArrowUp />
      <div class="ml-2 capitalize text-lg">Execute Deployment</div>
    </div>
  {/snippet}
  {#snippet body()}
    {#if result}
      <p class="mb-4 text-xs">Execution completed successfully!</p>
      <CodeBlock
        value={JSON.stringify(result, null, 2)}
        lang="json"
      />
    {:else}
      <div class="mt-4"></div>
      <span class="text-xs">Specify execution variables</span>
      <div class="w-full h-40 border border-strokeSub300 mt-1">
        <MonacoEditor
          value={$form.values.value}
          options={{ minimap: { enabled: false } }}
          onChange={(val) => {
            $form.change('value', val)
            $form.validate()
          }}
        />
      </div>
    {/if}
  {/snippet}
  {#snippet footer()}
    <div class="flex gap-2">
      <Button type="secondary" className="basis-full" onClick={onClose}>Cancel</Button>
      <Button
        className="basis-full"
        onClick={onExecute}
        icon={CloudArrowUp}
        isLoading={isLoading}
        isDisabled={$form.status.isError || isLoading || !!result}
      >
        Run
      </Button>
    </div>
  {/snippet}
</Flyout>
