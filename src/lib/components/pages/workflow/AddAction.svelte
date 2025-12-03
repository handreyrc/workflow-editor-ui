<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import { Accordion } from '@skeletonlabs/skeleton-svelte'

  import { useForm } from '$lib/utils/hooks'
  import type { DropDownOption } from '$lib/types/ui'
  import { addNewAction } from '$lib/utils/flow'

  import { Button, Flyout, Dropdown } from '$components/common/ui'
  import { ArrowLeft, SaveIcon } from '$components/icons'
  import FormField from '$components/common/FormField.svelte'
  import IconOpenClose from '$components/accordion'
  import MonacoEditor from '$components/common/MonacoEditor.svelte'

  import { actionTypeOptions, invokeOptions } from './constants'
  import { getActionType } from './utils'

  interface Props {
    type: 'add' | 'edit'
    action?: Specification.Action
    onViewChange: (value?: string) => void
    functions?: Specification.Functions
    events?: Specification.Events
    subflows?: Specification.Workflow[]
    onSave: (action: Specification.Action) => void
  }

  const {
    type,
    action,
    onViewChange,
    functions,
    events,
    subflows,
    onSave
  }: Props = $props()

  let actionType = $state(getActionType(action))
  let accordion = $state(['actionDataFilter'])

  const form = useForm({
    initialValues: {
      name: '',
      id: '',
      ...(action || {}),
      actionDataFilter: (action || {}).actionDataFilter || {
        fromStateData: '',
        useResults: true,
        results: '',
        toStateData: '',
      },
      functionRef: (action || {}).functionRef || {
        refName: '',
        arguments: ''
      },
      eventRef: (action || {}).eventRef || {
        triggerEventRef: '',
        resultEventRef: '',
        data: ''
      },
      subFlowRef: (action || {}).subFlowRef || {
        workflowId: '',
        invoke: 'sync',
      }
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!actionType) errors.actionType = 'Action type is required'
      if (actionType === 'function') {
        if (!values.functionRef?.refName) errors.functionRef = 'Function reference is required'
      }

      if (actionType === 'event') {
        if (!values.eventRef?.triggerEventRef) errors.triggerEventRef = 'Trigger event reference is required'
        if (!values.eventRef?.resultEventRef) errors.resultEventRef = 'Result event reference is required'
      }

      if (actionType === 'subflow') {
        if (!values.subFlowRef?.workflowId) errors.subFlowRef = 'Subflow reference is required'
      }

      return errors
    },
  })


  const getFunctionsOptions = (): DropDownOption[] => {
    if (!functions || typeof functions === 'string') return []

    return functions.map((item) => ({
      id: item.name,
      label: item.name,
      value: item.name,
    }))
  }

  const getEventsOptions = (filterFunc: (item: Specification.Eventdef) => boolean): DropDownOption[] => {
    if (!events || typeof events === 'string') return []

    return events
      .filter((item) => filterFunc(item))
      .map((item) => ({
        id: item.name || crypto.randomUUID(),
        label: item.name,
        value: item.name,
      } as DropDownOption))
  }

  const getSubflowOptions = (): DropDownOption[] => {
    return subflows?.map((item) => ({
      id: item.id,
      label: item.name || item.id,
      value: item.id,
    })) || []
  }

  const handleSave = () => {
    const data: Record<string, any> = $form.values

    if (actionType === 'event') {
      delete data.functionRef
      delete data.subFlowRef
    }

    if (actionType === 'function') {
      delete data.eventRef
      delete data.subFlowRef
    }

    if (actionType === 'subflow') {
      delete data.eventRef
      delete data.functionRef
    }

    onSave(addNewAction(data))
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
        <div class="capitalize text-lg">{type === 'edit' ? 'Edit' : 'Add'} Action</div>
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
        name="id"
        label="ID"
        tooltip="Unique identifier for the action"
        bind:value={$form.values.id}
        onChange={({ name, value }) => $form.change(name, value)}
        placeholder="Enter ID"
      />

      <div class="mt-4"></div>
      <Dropdown
        required
        label="Ref Type"
        selected={actionTypeOptions.find((option) => option.value === actionType)}
        options={actionTypeOptions}
        onChange={(option) => {
          actionType = option.value
          accordion.push('reference')
          $form.validate()
        }}
      />

      <Accordion
        value={accordion}
        onValueChange={(e) => (accordion = e.value)}
        collapsible
        multiple
      >
        {#snippet iconOpen()}<IconOpenClose />{/snippet}
        {#snippet iconClosed()}<IconOpenClose type="closed" />{/snippet}

        {#if actionType}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="reference"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center">
                <h4 class="text-sm font-medium">Reference</h4>
              </div>
            {/snippet}
            {#snippet panel()}
              {#if actionType === 'function'}
                {@const options = getFunctionsOptions()}
                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Function Reference"
                  selected={options.find((o) => o.value === $form.values.functionRef?.refName)}
                  options={options}
                  emptyText="No matching functions"
                  onChange={(option) => {
                    $form.change('functionRef.refName', option.value)
                    $form.validate()
                  }}
                />

                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Invoke"
                  selected={invokeOptions.find((option) => option.value === $form.values.functionRef?.invoke || 'sync')}
                  options={invokeOptions}
                  onChange={(option) => {
                    $form.change('functionRef.invoke', option.value)
                  }}
                />

                <div class="mt-4"></div>
                <span class="text-xs">Arguments</span>
                <div class="w-full h-40 border border-strokeSub300 mt-1">
                  <MonacoEditor
                    value={$form.values.functionRef?.arguments
                      ? JSON.stringify($form.values.functionRef?.arguments, null, 2)
                      : ''
                    }
                    onChange={(val) => {
                      $form.change('functionRef.arguments', val)
                      $form.validate()
                    }}
                    options={{ minimap: { enabled: false } }}
                  />
                </div>
              {/if}

              {#if actionType === 'event'}
                {@const producedOpts = getEventsOptions((item) => item.kind === 'produced')}
                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Trigger Event"
                  selected={producedOpts.find((o) => o.value === $form.values.eventRef?.triggerEventRef)}
                  options={producedOpts}
                  onChange={(option) => {
                    $form.change('eventRef.triggerEventRef', option.value)
                    $form.validate()
                  }}
                  emptyText="No matching events"
                />

                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Invoke"
                  selected={invokeOptions.find((option) => option.value === $form.values.eventRef?.invoke || 'sync')}
                  options={invokeOptions}
                  onChange={(option) => {
                    $form.change('eventRef.invoke', option.value)
                  }}
                />

                <div class="mt-4"></div>
                <span class="text-xs">Data</span>
                <div class="w-full h-40 border border-strokeSub300 mt-1">
                  <MonacoEditor
                    value={$form.values.eventRef?.data
                      ? JSON.stringify($form.values.eventRef?.data, null, 2)
                      : ''
                    }
                    onChange={(val) => {
                      $form.change('eventRef.data', val)
                      $form.validate()
                    }}
                    options={{ minimap: { enabled: false } }}
                  />
                </div>

                {@const consumedOpts = getEventsOptions((item) => item.kind === 'consumed')}
                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Result Event"
                  selected={consumedOpts.find((o) => o.value === $form.values.eventRef?.resultEventRef)}
                  options={consumedOpts}
                  onChange={(option) => {
                    $form.change('eventRef.resultEventRef', option.value)
                    $form.validate()
                  }}
                  emptyText="No matching events"
                />
              {/if}

              {#if actionType === 'subflow'}
                {@const options = getSubflowOptions()}
                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Sublow Reference"
                  selected={options.find((o) => o.value === $form.values.subFlowRef?.workflowId)}
                  options={options}
                  emptyText="No matching subflows"
                  onChange={(option) => {
                    $form.change('subFlowRef.workflowId', option.value)
                    $form.validate()
                  }}
                />

                <div class="mt-4"></div>
                <Dropdown
                  required
                  label="Invoke"
                  selected={invokeOptions.find((option) => option.value === $form.values.subflowRef?.invoke || 'sync')}
                  options={invokeOptions}
                  onChange={(option) => {
                    $form.change('subflowRef.invoke', option.value)
                  }}
                />
              {/if}
            {/snippet}
          </Accordion.Item>
        {/if}

        <div class="my-4 w-full border-b border-strokeSub300"></div>
        <Accordion.Item
          value="actionDataFilter"
          panelPadding="0"
          controlPadding="0"
        >
          {#snippet control()}
            <div class="flex items-center">
              <h4 class="text-sm font-medium">Action Data Filter</h4>
            </div>
          {/snippet}
          {#snippet panel()}
            <div class="mt-4"></div>
            <FormField
              name="actionDataFilter.fromStateData"
              label="From State Data"
              bind:value={$form.values.actionDataFilter.fromStateData}
              onChange={({ name, value }) => $form.change(name, value)}
              placeholder="Enter from state data"
            />

            <div class="mt-4"></div>
            <FormField
              type="switch"
              name="actionDataFilter.useResults"
              label="Use Results"
              bind:value={$form.values.actionDataFilter.useResults}
              onChange={({ name, value }) => {
                $form.change(name, value)
                $form.validate()
              }}
            />

            <div class="mt-4"></div>
            <FormField
              name="actionDataFilter.results"
              label="Results"
              bind:value={$form.values.actionDataFilter.results}
              onChange={({ name, value }) => $form.change(name, value)}
              placeholder="Enter results"
            />

            <div class="mt-4"></div>
            <FormField
              name="actionDataFilter.toStateData"
              label="To State Data"
              bind:value={$form.values.actionDataFilter.toStateData}
              onChange={({ name, value }) => $form.change(name, value)}
              placeholder="Enter To Sate Data"
            />
          {/snippet}
        </Accordion.Item>
      </Accordion>
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
