<script lang="ts">
  import { derived, type Readable, type Writable } from 'svelte/store'

  import { setIsWorkflowSaved, workflowsSelector } from '$lib/stores/workflowStore'
  import { type Maybe } from '$lib/types'

  import { CodeIcon, SparkleIcon, MinusIcon, GalleryViewIcon } from '$components/icons'
  import UnsavedChangesPopover from '$components/pages/workflow/sidebar/UnsavedChangesPopover.svelte'

  import Definitions from './side-panel/Definitions.svelte'
  import Builder from './side-panel/Builder.svelte'
  import Generator from './side-panel/Generator.svelte'

  interface Props {
    definitionsRef: Maybe<Definitions>
    selectedTab: Writable<string>
    isMinimized?: Readable<boolean>
    onMinimize?: (value: boolean) => void
    addNode: (type?: string, groupId?: string) => void
    buildWorkflowFromContext: (keepNodes?: boolean) => void
    zoomToNode?: (nodeId: string) => void
  }

  let {
    definitionsRef = $bindable(),
    isMinimized,
    selectedTab,
    onMinimize,
    addNode,
    buildWorkflowFromContext,
    zoomToNode,
  }: Props = $props()

  let popover = $state<string>()
  let isChatConnected = $state(false)
  const isSaved = derived(workflowsSelector, (store) => store?.isSaved)

  const handleChangeTab = (value: string = '', skipValidation = false) => {
    if ($isMinimized) {
      onMinimize?.(false)
    }

    if (!skipValidation && !$isSaved && $selectedTab !== value) {
      popover = popover || value
      return
    }

    $selectedTab = value
    popover = undefined
  }

  const handleDiscardChanges = () => {
    handleChangeTab(popover, true)
    setIsWorkflowSaved(true)
  }
</script>

<div
  class="wrapper min-h-0"
  class:isMinimized={$isMinimized}
>
  <div class="flex navWrapper pt-1">
    <div class="flex-1 flex items-center relative">
      {#if $selectedTab === 'chat'}
        <UnsavedChangesPopover bind:popover={popover} onDiscard={handleDiscardChanges} />
      {/if}
      <button
        class="nav__item"
        class:isSelected={$selectedTab === 'chat'}
        onclick={() => handleChangeTab('chat')}
      >
        <span class="icon"><SparkleIcon width={16} height={16} /></span>
        <span class="font-500 text-xs">Generator</span>
        <span
          class="ml-2 w-1 h-1 rounded-full"
          class:bg-successBase={isChatConnected}
          class:bg-errorBase={!isChatConnected}
        ></span>
      </button>
      {#if $selectedTab === 'code'}
        <UnsavedChangesPopover bind:popover={popover} onDiscard={handleDiscardChanges} />
      {/if}
      {#if $selectedTab === 'builder'}
        <UnsavedChangesPopover bind:popover={popover} onDiscard={handleDiscardChanges} />
      {/if}
      <button
        class="nav__item"
        onclick={() => handleChangeTab('builder')}
        class:isSelected={$selectedTab === 'builder'}
      >
        <span class="icon"><GalleryViewIcon width={16} height={16} /></span>
        <span class="font-500 text-xs">Editor</span>
      </button>
      <button
        class="nav__item"
        class:isSelected={$selectedTab === 'code'}
        onclick={() => handleChangeTab('code')}
      >
        <span class="icon"><CodeIcon width={16} height={16} /></span>
        <span class="font-500 text-xs">Code</span>
      </button>
    </div>
    {#if !$isMinimized}
      <button class="p-1 text-textSub600 mr-1" onclick={() => onMinimize?.(!$isMinimized)}>
        <MinusIcon />
      </button>
    {/if}
  </div>

  <div class="grow bg-bgSection min-h-0 h-full" class:hidden={$isMinimized}>
    <div class:hidden={$selectedTab !== 'chat'} class="w-full h-full flex flex-col grow">
      <Generator
        onWorkflowGenerate={() => buildWorkflowFromContext(false)}
        isOpen={$selectedTab === 'chat'}
        bind:isChatConnected
      />
    </div>

    {#if $selectedTab === 'code'}
      <Definitions bind:this={definitionsRef} />
    {/if}

    {#if $selectedTab === 'builder'}
      <Builder
        onAddNode={addNode}
        buildWorkflowFromContext={buildWorkflowFromContext}
        zoomToNode={zoomToNode}
      />
    {/if}
  </div>
</div>


<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .wrapper {
    @apply w-full h-full bg-pageBg flex flex-col grow;

    &.isMinimized {
      @apply w-auto h-auto px-2 py-1.5 absolute left-3 bottom-0 rounded-t-lg overflow-hidden border-r border-strokeSoft200 z-10;

      .navWrapper {
        @apply border-b-0;
      }

      .nav__item {
        @apply rounded-lg py-1 px-2;
        &:hover {
          @apply bg-bgSection;
        }

        &.isSelected {
          @apply border-0;
        }
      }
    }
  }

  .nav__item {
    @apply flex items-center px-3 py-2 text-textSub600 border border-transparent;

    &.isSelected {
      @apply bg-bgSection text-textStrong950 border-strokeSoft200 border-b-bgSection rounded-t-lg;

      &:first-child {
        @apply rounded-tl-none;
      }

      .icon {
        @apply text-primaryBase;
      }
    }
  }

  .icon {
    @apply center mr-1;
  }
</style>

