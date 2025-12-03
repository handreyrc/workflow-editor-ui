<script lang="ts">
  import { onMount, } from 'svelte'
  import { writable } from 'svelte/store'
  import { Accordion } from '@skeletonlabs/skeleton-svelte'

  import { type Tool, ToolType } from '$lib/types/tool'
  import type { Nullable } from '$lib/types'
  import type { Action } from '$lib/types/action'
  import { useForm } from '$lib/utils/hooks'
  import { getToolActions } from '$lib/stores/toolsStore'
  import type { FormFieldChange } from '$lib/types/form'
  import type { Paginated } from '$lib/types/index.js'

  import Flyout from '$components/common/ui/Flyout.svelte'
  import FormField from '$components/common/FormField.svelte'
  import { SaveIcon, TrashIcon } from '$components/icons'
  import ToolImage from '$components/common/ToolImage.svelte'
  import IconOpenClose from '$components/accordion'
  import { Button } from '$components/common/ui'
  import ShowMore from '$components/common/ShowMore.svelte'

  import searchIcon from '$assets/images/searchIcon.svg'

  import { getValueByFormat } from './utils'

  interface Props {
    type?: 'add' | 'edit'
    isOpen?: boolean
    isLoading?: boolean
    tool?: Nullable<Tool>
    hideActions?: boolean
    showDelete?: boolean
    initialValues?: {
      name?: string
      value?: string | Record<string, any>
    }
    onClose: () => void
    onDelete?: () => void
    onSave: (
      data: {
        form: Record<string, any>,
        tool: Nullable<Tool>
      }
    ) => void
  }

  let {
    type = 'add',
    isOpen = false,
    isLoading = false,
    tool = null,
    hideActions = false,
    showDelete = false,
    initialValues = {
      name: '',
      value: ''
    },
    onClose,
    onDelete,
    onSave
  }: Props = $props()

  const form = useForm({
    initialValues: {
      ...initialValues,
      value: getValueByFormat(tool?.format || '', tool?.name)
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Name is required'

      if (type === 'add') {
        if (tool?.format === ToolType.OAUTH2_TOKEN && !values.value) errors.value = 'Token is required'

        if (tool?.format === ToolType.OPENAI_CREDENTIALS) {
          if (!values.value?.baseUrl) errors.baseUrl = 'Base URL is required'
          if (!values.value?.apiKey) errors.apiKey = 'API Key is required'
        }

        if (tool?.format === ToolType.BASIC_AUTH) {
          if (!values.value?.username) errors.username = 'Username is required'
          if (!values.value?.password) errors.password = 'Password is required'
        }

        if (tool?.format === ToolType.CLIENT_KEY_CLIENT_SECRET) {
          if (!values.value.clientId) errors.clientId = 'Client ID is required'
          if (!values.value.clientPassword) errors.clientPassword = 'Client Password is required'
        }
      }

      return errors
    }
  })

  let search = writable('')
  let actions: Paginated<Action[]> = $state({
    totalCount: 0,
    items: []
  })
  let filteredActions: Action[] = $derived(actions?.items?.filter((action) => action.label.toLowerCase().includes($search.toLowerCase())))
  let accordion = $state(['actions'])

  onMount(async () => {
    if (!tool || hideActions) return

    actions = await getToolActions(tool.id)
  })

  const handleChangeSecret = ({ name, value }: FormFieldChange) => {
    const updatedValue = { ...($form.values.value as unknown as object), [name]: value }

    $form.errors[name] = ''
    $form.change('value', updatedValue)
    $form.touched[name] = true
  }

  const handleClickSave = () => {
    onSave({ form: $form.values, tool })
  }


</script>

{#if tool}
  <Flyout
    isOpen={isOpen}
    onClose={onClose}
    className="w-[380px]"
  >
    {#snippet header()}
      <div class="p-2 overflow-hidden w-full">
        <div class="flex items-center mb-2">
          <div class="bg-bgWhite0 p-2 w-10 h-10 center rounded-full border border-strokeSoft200 mr-2">
            <ToolImage iconName={tool.label} />
          </div>
          <div class="capitalize text-lg">{tool.label}</div>
        </div>

        <ShowMore>
          <p class="text-xs text-textSub600">{tool.description || ''}</p>
        </ShowMore>
      </div>
    {/snippet}

    {#snippet body()}
      <div>
        <FormField
          name="name"
          label="Name"
          bind:value={$form.values.name}
          onChange={({ name, value }) => $form.change(name, value)}
          onBlur={(name) => $form.blur(name)}
          required
          placeholder="Enter name"
          errorMessage={$form.touched.name ? $form.errors.name : ''}
        />

        <h4 class="mt-4 text-[15px] font-500">Credentials</h4>

        <div class="mt-4"></div>
        {#if tool.format === ToolType.OAUTH2_TOKEN && typeof $form.values.value === 'string'}
          <FormField
            name="value"
            label="Token"
            bind:value={$form.values.value}
            onChange={({ name, value }) => $form.change(name, value)}
            onBlur={(name) => $form.blur(name)}
            required
            type="password"
            placeholder={type === 'edit' ? '' : 'Enter token'}
            disabled={type === 'edit'}
            errorMessage={$form.touched.value ? $form.errors.value : ''}
          />
        {/if}

        {#if tool.format === ToolType.OPENAI_CREDENTIALS}
          <FormField
            name="baseUrl"
            label="Base URL"
            bind:value={$form.values.value.baseUrl}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('baseUrl')}
            required
            placeholder={type === 'edit' ? '' : 'Enter Base URL'}
            disabled={type === 'edit'}
            errorMessage={$form.touched.baseUrl ? $form.errors.baseUrl : ''}
          />
          <div class="mt-4"></div>
          <FormField
            name="apiKey"
            label="API Key"
            bind:value={$form.values.value.apiKey}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('apiKey')}
            required
            type="password"
            placeholder={type === 'edit' ? '' : 'Enter API Key'}
            disabled={type === 'edit'}
            errorMessage={$form.touched.apiKey ? $form.errors.apiKey : ''}
          />
        {/if}

        {#if tool.format === ToolType.CLIENT_KEY_CLIENT_SECRET}
          <FormField
            name="clientId"
            label="Client ID"
            bind:value={$form.values.value.clientId}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('clientId')}
            errorMessage={$form.touched.clientId ? $form.errors.clientId : ''}
            required
            placeholder={type === 'edit' ? '' : 'Enter Client ID'}
            disabled={type === 'edit'}
          />
          <div class="mt-4"></div>
          <FormField
            name="clientPassword"
            label="Client Password"
            bind:value={$form.values.value.clientPassword}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('clientPassword')}
            errorMessage={$form.touched.clientPassword ? $form.errors.clientPassword : ''}
            required
            type="password"
            placeholder={type === 'edit' ? '' : 'Enter API Key'}
            disabled={type === 'edit'}
          />
        {/if}

        {#if tool.format === ToolType.BASIC_AUTH}
          <FormField
            name="username"
            label="Username"
            bind:value={$form.values.value.username}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('username')}
            errorMessage={$form.touched.username ? $form.errors.username : ''}
            required
            placeholder={type === 'edit' ? '' : 'Enter Username'}
            disabled={type === 'edit'}
          />
          <div class="mt-4"></div>
          <FormField
            name="password"
            label="Password"
            bind:value={$form.values.value.password}
            onChange={handleChangeSecret}
            onBlur={() => $form.blur('password')}
            errorMessage={$form.touched.password ? $form.errors.password : ''}
            required
            type="password"
            placeholder={type === 'edit' ? '' : 'Enter Password'}
            disabled={type === 'edit'}
          />
        {/if}

        {#if !hideActions}
          <div class="actions mt-4">
          <Accordion
            value={accordion}
            onValueChange={(e) => (accordion = e.value)}
            collapsible
          >
            {#snippet iconOpen()}<IconOpenClose />{/snippet}
            {#snippet iconClosed()}<IconOpenClose type="closed" />{/snippet}
            <Accordion.Item
              value="actions"
              panelPadding="0"
              controlPadding="0"
            >
              {#snippet control()}
                <div class="flex items-center" >
                  <h4 class="text-[15px] font-500">Available Actions</h4>
                  <div class="ml-2 px-1 py-0.5 bg-fadedLighter rounded-xs text-textSub600 text-[11px] font-500 leading-none">{actions.length}</div>
                </div>
              {/snippet}

              {#snippet panel()}
                <div class="flex items-center p-2 mt-2 w-full h-9 rounded-md border border-strokeSub300">
                  <img src={searchIcon} alt="searchIcon" class="w-4 h-4">
                  <input
                    type="text"
                    placeholder="Search available actions"
                    class="bg-transparent ml-2 w-full text-[12px] focus:outline-hidden focus:ring-0 focus:border-0"
                    bind:value={$search}
                  />
                </div>

                <div class="mt-4">
                  {#each filteredActions as action (action.id)}
                    <div class="mb-4 text-xs">
                      <span>#{action.label} ({action.name})</span>
                      <p class="mt-1 text-textSub600">{action.description}</p>
                    </div>
                  {/each}
                </div>
              {/snippet}
            </Accordion.Item>
          </Accordion>
        </div>
        {/if}
      </div>
    {/snippet}

    {#snippet footer()}
      <div class="flex justify-between gap-2">
        <Button type="secondary" className="basis-full" onClick={onClose}>Cancel</Button>
        {#if type === 'edit' || showDelete}
          <Button
            className="basis-full"
            type="danger"
            onClick={() => onDelete?.()}
            icon={TrashIcon}
          >
            Delete
          </Button>
        {/if}
        <Button
          className="basis-full"
          onClick={handleClickSave}
          isDisabled={$form.status.isError || isLoading}
          {isLoading}
          icon={SaveIcon}
          iconSize={12}
        >
          {type === 'add' ? 'Provision' : 'Save'}
        </Button>
      </div>
    {/snippet}
  </Flyout>
{/if}

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .actions :global(.accordion-item) {
    @apply mt-0 py-3 border-t border-t-strokeSoft200;
  }

  .actions :global(.accordion-item .accordion-control) {
    @apply p-0 py-1;
  }

  .actions :global(.accordion-item .accordion-panel) {
    @apply p-0 py-1;
  }
</style>
