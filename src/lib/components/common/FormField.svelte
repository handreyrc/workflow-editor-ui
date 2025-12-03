<script lang="ts">
  import cx from 'classnames'

  import type { FieldType, FormFieldChange } from '$lib/types/form'

  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import InfoIcon from '$components/icons/InfoIcon.svelte'

  interface Props {
    label?: string
    name?: string
    required?: boolean
    tooltip?: string
    placeholder?: string
    type?: FieldType
    value?: string | number | boolean | File | null | undefined
    options?: string[]
    min?: number
    max?: number
    disabled?: boolean
    errorMessage?: string
    className?: string
    errorClass?: string
    onChange: ({ name, value }: FormFieldChange) => void
    onBlur?: (name: string) => void
  }

  let {
    label = '',
    name = '',
    required = false,
    tooltip = '',
    placeholder = '',
    type = 'text',
    value = $bindable(''),
    options = [],
    min = 0,
    max = 0,
    disabled = false,
    errorMessage = '',
    errorClass = '',
    className = '',
    onChange,
    onBlur
  }: Props = $props()

  const handleInputChange = () => {
    onChange({ name, value })
  }

  const handleCheckBoxChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    onChange({ name, value: target.checked })
  }

  const handleRadioChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    onChange({ name: name, value: target.value })
  }
</script>

<div class="w-full">
  {#if type === 'switch'}
    <label class="inline-flex items-center relative switcher" for="{name}">
      <input
        type="checkbox"
        class="sr-only peer"
        id={name}
        checked={!!value}
        onchange={handleCheckBoxChange}
      />
      <div class="switch-toggle"></div>
      <span class="ml-2 text-xs normal-case">{label}</span>
    </label>
  {/if}

  {#if type === 'radio' && options}
    {#each options as option}
      <label class="flex items-center cursor-pointer py-2 rounded-md ">
        <input
          type="radio"
          name={name}
          class="mr-2 hidden text-[12px]"
          bind:group={value}
          value={option}
          onchange={handleRadioChange}
        />
        <span class="w-4 h-4 border-2 border-strokeSub300 rounded-full flex items-center justify-center">
          {#if value === option}
            <div class="w-2 h-2 bg-primaryBase rounded-full"></div>
          {/if}
        </span>
        <span class="ml-2 text-[12px]">{option}</span>
      </label>
    {/each}
  {/if}

  {#if !['switch', 'radio'].includes(type)}
    <div
      class="form-field-wrapper rounded-md border bg-transparent border-strokeSub300 flex flex-col"
      class:error={errorMessage}
    >
      <label
        class="flex items-center px-2.5 pt-0.5 text-sm leading-[20px]"
        class:opacity-50={disabled}
        for={name}
      >
        <span class="text-[11px]" >{label}</span>
        {#if required}
          <span class="text-errorBase ml-1 mr-1">*</span>
        {/if}

        {#if tooltip}
          <Tooltip
            content={tooltip}
          >
            <span class="ml-0.5 text-iconSub600 mt-[-2px]"><InfoIcon width={16} height={16} /></span>
          </Tooltip>
        {/if}
      </label>

      {#if type === 'text' || type === 'string'}
      <input
        type="text"
        class={cx('form-field', className)}
        class:opacity-50={disabled}
        id={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        bind:value={value}
        oninput={handleInputChange}
        onblur={() => onBlur?.(name)}
        autocomplete="off"
      />

      {:else if type === 'password' || type === 'secret'}
      <input
        type="password"
        class="form-field"
        placeholder={placeholder}
        class:opacity-50={disabled}
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        bind:value={value}
        oninput={handleInputChange}
        onblur={() => onBlur?.(name)}
      />

      {:else if type === 'textarea'}
      <textarea
        id={name}
        class={cx('form-field min-h-16 max-h-40 scroll-pb-2', className)}
        class:opacity-50={disabled}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        bind:value={value}
        oninput={handleInputChange}
        onblur={() => onBlur?.(name)}
      ></textarea>

      {:else if type === 'file_upload'}
      <input
        type="file"
        id={name}
        class:opacity-50={disabled}
        disabled={disabled}
        onchange={(e) => {
          value = e.target?.files?.[0] || null
          handleInputChange()
        }}
      />

      {:else if type === 'number' || type === 'integer'}
      <input
        type="number"
        class="form-field"
        class:opacity-50={disabled}
        id={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        oninput={handleInputChange}
        bind:value={value}
        onblur={() => onBlur?.(name)}
      />

      {:else if type === 'slider'}
      <input
        type="range"
        class:opacity-50={disabled}
        id={name}
        min={min ?? 0}
        max={max ?? 100}
        disabled={disabled}
        bind:value={value}
      />

      {:else if type === 'dropdown' && options}
      <select
        id={name}
        bind:value={value}
        onchange={handleInputChange}
        class="px-1.5 py-1 mr-2 bg-transparent text-[12px] outline-0"
        disabled={disabled}
        class:opacity-50={disabled}
      >
        {#each options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      {/if}
    </div>
    {#if errorMessage}
      <span class={cx('mt-2 text-errorDark text-[11px] font-poppins', errorClass)}>{errorMessage}</span>
    {/if}
  {/if}
</div>

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .form-field-wrapper.error {
    @apply border-errorBase transition-colors;
  }

  .form-field {
    @apply w-full p-2.5 pt-1 bg-transparent text-textStrong950 text-xs;
  }

  .form-field:focus {
    border: 0 !important;
    outline: 0 !important;
  }
</style>
