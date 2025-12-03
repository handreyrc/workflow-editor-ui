<script lang="ts">
  import { Accordion } from '@skeletonlabs/skeleton-svelte'
  import { type Writable } from 'svelte/store'
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Node } from '@xyflow/svelte'

  import { useForm, type UseForm } from '$lib/utils/hooks/useForm'
  import type { WorkflowForm } from '$lib/types/forms/workflow'
  import { isValidISO8601Date, isValidJSONObject } from '$lib/utils/workflow/validators'

  import IconOpenClose from '$components/accordion'
  import States from '$components/pages/workflow/builder/States.svelte'
  import Definition from '$components/pages/workflow/builder/Definition.svelte'
  import Functions from '$components/pages/workflow/builder/Functions.svelte'
  import Errors from '$components/pages/workflow/builder/Errors.svelte'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  import { initializeValues } from './form'

  interface Props {
    workflow: Specification.Workflow
    onAddNode: (type?: string) => void
    nodes: Node[]
    isIdDisabled?: boolean
    onFormInit?: (form: Writable<UseForm<WorkflowForm>>) => void
  }

  let {
    nodes,
    workflow,
    isIdDisabled,
    onFormInit,
    onAddNode,
  }: Props = $props()
  let accordion = $state(['nodes'])

  const form: Writable<UseForm<WorkflowForm>> = useForm({
    initialValues: initializeValues(workflow),
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.id && !values.key) errors.id = 'Workflow ID/Key is required'

      if (values.annotations && !Array.isArray(values.annotations)) {
        errors.annotations = 'Invalid format for annotations'
      }

      if (values.dataInputSchema) {
        if (!isValidJSONObject(values.dataInputSchema)) errors.dataInputSchema = 'Data input schema should be a valid JSON object'
      }

      if (values.constants) {
        if (!isValidJSONObject(values.constants)) errors.constants = 'Constants should be a valid JSON object'
      }

      if (values.metadata) {
        if (!isValidJSONObject(values.metadata)) errors.metadata = 'Metadata should be a valid JSON object'
      }

      if (values.timeouts) {
        if (values.timeouts.workflowExecTimeout && typeof values.timeouts.workflowExecTimeout !== 'object') {
          if (!isValidISO8601Date(values.timeouts.workflowExecTimeout)) {
            errors['timeouts.workflowExecTimeout'] = 'Workflow execution timeout should be a valid ISO 8601 duration'
          }
        }
        if (values.timeouts.eventTimeout) {
          if (!isValidISO8601Date(values.timeouts.eventTimeout)) {
            errors['timeouts.eventTimeout'] = 'Event timeout should be a valid ISO 8601 duration'
          }
        }
      }

      return errors
    },
  })

  onFormInit?.(form)
</script>

<Accordion
  value={accordion}
  onValueChange={(e) => (accordion = e.value)}
  collapsible
>
  {#snippet iconOpen()}<IconOpenClose />{/snippet}
  {#snippet iconClosed()}<IconOpenClose type="closed" />{/snippet}
  <Accordion.Item
    value="global"
    panelPadding="0"
    controlPadding="0"
    controlClasses="px-4 py-2 mb-2"
    panelClasses="px-4 overflow-auto grow"
  >
    {#snippet control()}
      <div class="flex items-center"><h4 class="text-xs">Global</h4></div>
    {/snippet}
    {#snippet panel()}
      <Definition
        form={form}
        isIdDisabled={isIdDisabled}
        nodes={nodes.filter(({ data }) => data.state)}
      />
    {/snippet}
  </Accordion.Item>

  <Accordion.Item
    value="nodes"
    panelPadding="0"
    controlPadding="0"
    controlClasses="px-4 py-2 mb-2"
    panelClasses="px-4"
  >
    {#snippet control()}
      <div class="flex items-center"><h4 class="text-xs">States</h4></div>
    {/snippet}
    {#snippet panel()}
      <States onAddNode={onAddNode} />
    {/snippet}
  </Accordion.Item>

  <Accordion.Item
    value="functions"
    panelPadding="0"
    controlPadding="0"
    controlClasses="px-4 py-2 mb-2"
    panelClasses="px-4"
  >
    {#snippet control()}
      <div class="flex items-center"><h4 class="text-xs">Functions</h4></div>
    {/snippet}
    {#snippet panel()}
      <Functions form={form} />
    {/snippet}
  </Accordion.Item>

  <Accordion.Item
    value="errors"
    panelPadding="0"
    controlPadding="0"
    controlClasses="px-4 py-2 mb-2"
    panelClasses="px-4"
  >
    {#snippet control()}
      <div class="flex items-center"><h4 class="text-xs">Errors</h4></div>
    {/snippet}
    {#snippet panel()}
      <Errors  form={form} />
    {/snippet}
  </Accordion.Item>

  <Accordion.Item
    value="events"
    panelPadding="0"
    controlPadding="0"
    controlClasses="px-4 py-2 mb-2"
    panelClasses="px-4"
  >
    {#snippet control()}
      <div class="flex items-center">
        <h4 class="text-xs">Events</h4>
      </div>
    {/snippet}
    {#snippet panel()}
      <div class="pt-8 flex flex-col items-center justify-center">
        <img src={EmptyActionsImg} alt="" />
        <div class="text-sm mt-8 text-center">Events functionality will be available <br /> in a future update</div>
      </div>
    {/snippet}
  </Accordion.Item>
</Accordion>
