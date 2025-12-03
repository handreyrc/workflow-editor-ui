<script lang="ts">
  interface Props {
    width?: number;
    height?: number;
  }

  let { width = 20, height = 20 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 16 16" fill="none">
  <path d="M6.8001 11.6H9.2001V10.4H6.8001V11.6ZM2.6001 4.40002V5.60002H13.4001V4.40002H2.6001ZM4.4001 8.60002H11.6001V7.40002H4.4001V8.60002Z" />
</svg>
