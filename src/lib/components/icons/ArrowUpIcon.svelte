<script lang="ts">
  interface Props {
    width?: number;
    height?: number;
  }

  let { width = 24, height = 24 }: Props = $props();
</script>

<svg {width} {height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.59999 5.4968V12.8H7.39999V5.4968L4.18159 8.7152L3.33319 7.8668L7.99999 3.2L12.6668 7.8668L11.8184 8.7152L8.59999 5.4968Z" />
</svg>
