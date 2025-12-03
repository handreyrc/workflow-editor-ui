<script lang="ts">
  import type { FormFieldChange } from '$lib/types/form'

  import { CheckIcon, FilterIcon } from '$components/icons'
  import Popover from '$components/common/ui/Popover.svelte'
  import FormField from '$components/common/FormField.svelte'
  import { Button } from '$components/common/ui'

  import searchIcon from '$assets/images/searchIcon.svg'

  interface Props {
    isFilter?: boolean
    searchQuery?: string
    filter?: string
    options?: any
    onSearch?: (value: string) => void
    onFilter?: (value: string) => void
  }

  let {
    isFilter = true,
    searchQuery = $bindable(''),
    filter = $bindable('All'),
    options = ['All', 'LLM', 'Tool'],
    onSearch,
    onFilter
  }: Props = $props()

  let isFilterOpen = $state(false)

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    searchQuery = value
    onSearch?.(value)
  }

  const handleFilterChange = ({ value }: FormFieldChange) => {
    filter = value as string
  }

  const onApply = () => {
    onFilter?.(filter)
    isFilterOpen = false
  }

  const onClear = () => {
    filter = 'All'
    searchQuery = ''
    onFilter?.(filter)
    isFilterOpen = false
  }
</script>

<div class="flex flex-wrap items-center justify-end rounded-md space-y-2 sm:space-y-0">
  <div class="flex items-center bg-pageBg p-2 w-80 h-9 rounded-md border border-strokeSub300">
    <img src={searchIcon} alt="searchIcon" class="w-4 h-4">
    <input
      type="text"
      placeholder="Search..."
      class="bg-transparent ml-2 w-full text-[12px] focus:outline-hidden focus:ring-0 focus:border-0"
      bind:value={searchQuery}
      oninput={handleSearch}
    />
    {#if isFilter}
      <Popover
        isOpen={isFilterOpen}
        onOpenChange={(isOpen) => isFilterOpen = isOpen}
        classes="center"
      >
        {#snippet button()}
          <span
            class="center"
            class:bg-primaryBase={isFilterOpen || filter !== 'All'}
          >
            <FilterIcon />
          </span>
        {/snippet}

        <div class="bg-pageBg text-white rounded-lg p-4 w-80 border border-strokeSub300 mr-2 mt-2">
          <h3 class=" border-b border-strokeSub300 text-white pb-2 text-[14px]">Filters</h3>

          <div class="flex flex-col mt-4">
            <FormField
              name="Filter"
              options={options}
              value={filter}
              type="radio"
              onChange={handleFilterChange}
            />
          </div>

          <div class="text-[12px] flex justify-between mt-4 items-center border-t border-strokeSub300 pt-3 space-x-2">
            <Button type="secondary" className="basis-full py-1" onClick={onClear}>Clear</Button>
            <Button
              className="basis-full py-1"
              onClick={onApply}
              icon={CheckIcon}
              iconSize={14}
            >Apply</Button>
          </div>
        </div>
      </Popover>
    {/if}
  </div>
</div>
