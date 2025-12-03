<script lang="ts">
  interface Props {
    width?: number
    height?: number
  }

  let { width = 20, height = 20 }: Props = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 14 14" fill="none">
  <path d="M10.0625 3.9375H2.1875V11.8125H10.0625V3.9375Z" stroke="currentColor" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3.9375 2.1875H11.8125V10.0625" stroke="currentColor" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
