<script lang="ts" generics="TypedColumn">
  import { onMount, type Snippet } from 'svelte'
  import { writable } from 'svelte/store'
  import cx from 'classnames'
  import { ka } from 'date-fns/locale'

  import type { Column } from '$lib/types/table'

  import Pagination from './Pagination.svelte'

  interface Props {
    columns?: Column<TypedColumn>[]
    data?: TypedColumn[]
    initialSortKey?: string
    initialSortAsc?: boolean
    pageSize?: number
    totalCount?: number
    isFiltering?: boolean
    onSort?: (
      data: {
        columnKey: keyof TypedColumn
        direction: 'asc' | 'desc' | 'none'
      }
    ) => void
    onPageChange?: (page: number) => void
    onRowClick?: (row: TypedColumn) => void
    noResults?: Snippet
  }

  let {
    columns = [],
    data = [],
    initialSortKey = '',
    initialSortAsc = true,
    pageSize = 5,
    totalCount = 1,
    isFiltering = false,
    onSort,
    onPageChange,
    onRowClick,
    noResults
  }: Props = $props()

  let sortKey: keyof TypedColumn = $state(initialSortKey as keyof TypedColumn)
  let sortState: 'asc' | 'desc' | 'none' = $state(initialSortKey ? (initialSortAsc ? 'asc' : 'desc') : 'none')

  const currentPage = writable(1)
  const sortedData = writable([...data])
  const totalPages = Math.ceil(totalCount / pageSize)

  const applySort = () => {
    let sortedCopy = [...data]

    if (sortState !== 'none') {
      sortedCopy.sort((a: TypedColumn, b: TypedColumn) => {
        const valA = a[sortKey]
        const valB = b[sortKey]

        if (valA < valB) return sortState === 'asc' ? -1 : 1
        if (valA > valB) return sortState === 'asc' ? 1 : -1
        return 0
      })
    }

    sortedData.set(sortedCopy)
    onSort?.({ columnKey: sortKey, direction: sortState })
  }

  const handleSort = (columnKey: keyof TypedColumn) => {
    if (sortKey !== columnKey) {
      sortKey = columnKey
      sortState = 'asc'
    } else {
      sortState = sortState === 'asc' ? 'desc' : sortState === 'desc' ? 'none' : 'asc'
    }
    applySort()
  }

  const goToPage = (page: number) => {
    currentPage.set(page)
    onPageChange?.(page)
  }

  onMount(() => {
    if (initialSortKey) {
      applySort()
    } else {
      sortedData.set([...data])
    }
  })


  $effect(() => {
    if (data) {
      sortedData.set([...data])
      applySort()
    }
  })
</script>

<div class="grow">
  <table class="min-w-full">
    <thead>
    <tr class="bg-tableHeader text-sm">
      {#each columns as column (column.key)}
        <th
          class={`p-2 text-left cursor-pointer select-none font-normal ${column.className || ''}`}
          onclick={() => column.isSorting && handleSort(column.key)}
        >
          <div class="flex items-center gap-1">
            {column.label}
            {#if column.isSorting}
              <span class="text-[8px]">
                {#if sortKey === column.key}
                  {#if sortState === 'asc'}
                    ▲
                  {:else if sortState === 'desc'}
                    ▼
                  {/if}
                {/if}
              </span>
            {/if}
          </div>
        </th>
      {/each}
    </tr>
    </thead>
    <tbody>
    {#each $sortedData as row, index (row.id || index)}
      <tr class="bg-bgSection text-xs hover:bg-primaryAlpha16 cursor-pointer" onclick={() => onRowClick?.(row)}>
        {#each columns as column (column.key)}
          <td class={cx('p-2', column.className)}>
            {#if column.render}
              {@html column.render(row[column.key], row)}
            {:else if column.component}
              {@const CellComponent = column.component}
              <CellComponent row={row} />
            {:else}
              {row[column.key]}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>
  {#if $sortedData.length === 0}
    {#if noResults && !isFiltering}
      {@render noResults()}
    {:else}
      <div class="text-center my-3 text-sm text-textSub600">No results found</div>
    {/if}
  {/if}
</div>


{#if $sortedData.length}
  {#if !isFiltering}
    <div class="center mt-4">
      <Pagination
        currentPage={$currentPage}
        totalPages={totalPages}
        onChange={goToPage}
      />
    </div>
  {/if}
{/if}
