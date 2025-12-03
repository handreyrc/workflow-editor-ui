<script lang="ts">
  import { parseDocument, stringify } from 'yaml'

  import { useForm } from '$lib/utils/hooks'
  import { ToolType } from '$lib/types/tool'
  import type { FormFieldChange } from '$lib/types/form'

  import FormField from '$components/common/FormField.svelte'
  import { SaveIcon, TrashIcon } from '$components/icons'
  import { Button, FileDrop, Dropdown, Flyout } from '$components/common/ui'

  import customToolIcon from '$assets/images/customTool.svg'

  import type { FormValues } from './types'

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
  const formatOptions = [
    { id: ToolType.OAUTH2_TOKEN, label: 'OAuth2 Token', value: ToolType.OAUTH2_TOKEN },
    { id: ToolType.CLIENT_KEY_CLIENT_SECRET, label: 'Client Credentials', value: ToolType.CLIENT_KEY_CLIENT_SECRET },
    { id: ToolType.OPENAI_CREDENTIALS, label: 'OpenAI Credentials', value: ToolType.OPENAI_CREDENTIALS },
    { id: ToolType.BASIC_AUTH, label: 'Basic Auth', value: ToolType.BASIC_AUTH },
    { id: ToolType.NONE, label: 'None', value: ToolType.NONE },
  ]

  const importOptions = ['Import Schema from URL', 'Import Schema from File']

  interface Props {
    type?: 'add' | 'edit'
    isOpen?: boolean
    isLoading?: boolean
    initialValues?: FormValues
    onClose: () => void
    onDelete: () => void
    onSave: (values: FormValues) => void
  }

  let {
    type = 'add',
    isOpen = false,
    isLoading = false,
    initialValues = {
      name: '',
      link: '',
      schema: '',
      credentials: '',
      url: ''
    },
    onClose,
    onDelete,
    onSave
  }: Props = $props()

  let importOption = $state(importOptions[0])

  const form = useForm<FormValues>({
    initialValues: initialValues,
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Name is required'

      if (!values.link) errors.link = 'Link is required'
      if (values.link && values.link.match(/^(http|https):\/\/[^ "]+$/) === null) errors.link = 'Link is not valid'

      if (importOption === importOptions[0]) {
        if (!values.url) errors.url = 'Schema URL is required'
        if (values.url?.match(/^(http|https):\/\/[^ "]+$/) === null) {
          errors.url = 'Schema URL is not valid'
        }
      }

      if (importOption === importOptions[1]) {
        if (!values.schema) errors.schema = 'Schema is required'
      }

      if (type === 'add') {
        if (!values.credentials) errors.credentials = 'Format is required'
      }

      return errors
    }
  })

  const handleImportOptionChange = ({ value }: FormFieldChange) => {
    importOption = value as string
    $form.validate()
  }

  const handleFilesSelected = (files: File[]) => {
    const file = files?.[0] as File

    if (file.size > MAX_FILE_SIZE) {
      $form.change('schema', '')
      $form.blur('schema')
      return
    }

    if (file) {
      const reader = new FileReader()

      reader.readAsText(file)
      reader.onload = (e) => {
        try {
          const fileYAML = file.type === 'application/json'
            ? stringify(JSON.parse(e.target?.result as string))
            : e.target?.result as string

          $form.change('schema', parseDocument(fileYAML))
          // trigger validation for schema
          $form.blur('schema')
        } catch {
          $form.change('schema', '')
          $form.blur('schema')
        }
      }

      return
    }

    $form.change('schema', '')
    // trigger validation for schema
    $form.blur('schema')
  }

  const handleClickSave = () => {
    const values = { ...$form.values }

    if (importOption === importOptions[0]) {
      delete values.schema
    }

    if (importOption === importOptions[1]) {
      delete values.url
    }

    onSave(values)
  }
</script>

{#if isOpen}
  <Flyout
    isOpen
    onClose={onClose}
    className="w-[380px]"
  >
    {#snippet header()}
      <div  class="p-2">
        <div class="flex items-center mb-2">
          <div class="bg-bgWhite0 p-2 w-10 h-10 center rounded-full border border-strokeSoft200 mr-2">
            <img src={customToolIcon} alt="customToolIcon">
          </div>
          <div class="capitalize text-lg">Custom Tool</div>
        </div>

        <p class="text-xs text-textSub600">Link your own tools</p>
      </div>
    {/snippet}

    {#snippet body()}
      <div class:disabled-container={isLoading}>
        <FormField
          name="name"
          label="Schema Name"
          bind:value={$form.values.name}
          onChange={({ name, value }) => $form.change(name, value?.replace?.(' ', ''))}
          onBlur={(name) => $form.blur(name)}
          errorMessage={$form.touched.name ? $form.errors.name : ''}
          required
          placeholder="Enter schema name"
        />

        <div class="mt-4"></div>
        <div class="w-full">
          <Dropdown
            label="Format"
            required
            options={formatOptions}
            selected={formatOptions.find((option) => option.value === $form.values.credentials)}
            onChange={({ value }) => $form.change('credentials', value)}
          />
        </div>

        <div class="mt-4"></div>
        <FormField
          required
          name="link"
          label="Link"
          tooltip="Link to the tool"
          bind:value={$form.values.link}
          onChange={({ name, value }) => $form.change(name, value)}
          onBlur={(name) => $form.blur(name)}
          errorMessage={$form.touched.link ? $form.errors.link : ''}
          placeholder="Enter link"
        />

        <div class="mt-4"></div>
        <FormField
          name="Import schema"
          options={importOptions}
          value={importOption}
          type="radio"
          onChange={handleImportOptionChange}
        />

        <div class="mt-4"></div>
        {#if importOption === importOptions[0]}
          <FormField
            name="url"
            label="Schema URL"
            required
            tooltip="Url to the schema"
            bind:value={$form.values.url}
            onChange={({ name, value }) => $form.change(name, value)}
            onBlur={(name) => $form.blur(name)}
            errorMessage={$form.touched.url ? $form.errors.url : ''}
            placeholder="Enter Schema URL"
          />
        {/if}

        <!--hidden - to not rerender it from scratch and save the state of the component-->
        <div class:hidden={importOption === importOptions[0]}>
          <FileDrop
            accept={['application/json', 'application/x-yaml']}
            label="Schema"
            required
            onFileChange={handleFilesSelected}
          >
            <div class="text-textStrong950 mt-4 text-sm">
              Choose your swagger file or drag & drop it here.
            </div>
            <p class="text-xs mt-4">JSON and YAML formats, up to 50 MB.</p>
            <button class="mt-4 button text-xs border border-strokeSoft200">Browse File</button>
          </FileDrop>
        </div>
      </div>
    {/snippet}

    {#snippet footer()}
      <div  class="flex justify-between gap-2">
        <Button
          type="secondary"
          className="basis-full"
          onClick={onClose}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
        {#if type === 'edit'}
          <Button
            type="danger"
            className="basis-full"
            onClick={onDelete}
            isDisabled={isLoading}
            icon={TrashIcon}
            iconSize={16}
          >
            Delete
          </Button>
        {/if}
        <Button
          type="primary"
          className="basis-full"
          onClick={handleClickSave}
          isDisabled={$form.status.isError || isLoading}
          isLoading={isLoading}
          icon={SaveIcon}
          iconSize={12}
        >
          Save
        </Button>
      </div>
    {/snippet}
  </Flyout>
{/if}
