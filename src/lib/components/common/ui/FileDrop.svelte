<script lang="ts">
  import Dropzone from 'svelte-file-dropzone'
  import { writable } from 'svelte/store'
  import cx from 'classnames'
  import { type Snippet } from 'svelte'

  import { CloseIcon } from '$components/icons'

  import attachmentIcon from '$assets/images/cloud.svg'
  import uploadedFile from '$assets/images/uploadedFile.svg'

  interface Props {
    accept?: Array<string>
    maxFiles?: number
    label?: string
    required?: boolean
    children?: Snippet
    onFileChange: (files: File[]) => void
  }

  let {
    accept = [],
    maxFiles = 1,
    label = '',
    required = false,
    children,
    onFileChange
  }: Props = $props()

  let uploadedFiles = writable([])

  const handleFilesSelect = ({ detail }: CustomEvent) => {
    const { acceptedFiles } = detail
    uploadedFiles.set(acceptedFiles)

    onFileChange(acceptedFiles)
  }

  const handleDeleteFile = (file: File) => {
    uploadedFiles.update((files) => files.filter((f) => f !== file))

    onFileChange($uploadedFiles)
  }
</script>

<div>
  {#if label}
    <div class="flex items-center py-0.5 text-sm leading-[20px]">
      <span class="text-[11px]" >{label}</span>
      <span class="text-errorBase ml-1">{required ? '*' : ''}</span>
    </div>
  {/if}
  <div class="mb-2 flex items-center space-x-2">
    <Dropzone
      on:drop={handleFilesSelect}
      accept={accept}
      containerClasses={cx('fileDrop', { ['isDisabled']: $uploadedFiles.length >= maxFiles })}
      disabled={$uploadedFiles.length >= maxFiles}
    >
      <img src={attachmentIcon} alt="attach" class="w-8 h-8"/>
      {@render children?.()}
    </Dropzone>
  </div>
</div>

{#if $uploadedFiles.length > 0}
  <div class="uploaded-files">
    {#each $uploadedFiles as file}
      <div class="flex items-center space-x-2">
        <img src={uploadedFile} alt="file icon" class="w-4 h-4" />
        <span class="text-[12px]">{file.name}</span>
        <button
          class="text-errorBase ml-1"
          onclick={() => handleDeleteFile(file)}
        ><CloseIcon width={12} height={12} /></button>
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  :global(.fileDrop) {
    background: transparent !important;
    border: 1px dashed var(--stroke-sub-300) !important;
    border-radius: 12px !important;
  }

  :global(.fileDrop.isDisabled) {
    opacity: 0.5 !important;
  }
</style>
