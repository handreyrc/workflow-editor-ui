<script lang="ts">
  import { ArrowLeft } from '$components/icons'
  interface Props {
    currentPage?: number
    totalPages?: number
    onChange: (page: number) => void
  }

  let {
    currentPage = 1,
    totalPages = 1,
    onChange
  }: Props = $props()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page)
    }
  }
</script>

<div  class="center w-full">
  <button
    class="center rounded-full w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed border border-strokeSub300"
    onclick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    <ArrowLeft width={12} height={12} />
  </button>

  <!-- Page Indicator -->
  <span class="text-sm text-strokeStrong950 px-12">
    Page {currentPage} of {totalPages}
  </span>

  <!-- Next Button -->
  <button
    class="center rounded-full w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed border border-strokeSub300"
    onclick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}>
    <span class="rotate-180">
       <ArrowLeft width={12} height={12} />
    </span>
  </button>
</div>
