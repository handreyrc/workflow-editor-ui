<script lang="ts">
  interface Props {
    width?: number
    height?: number
  }

  let { width = 16, height = 16 }: Props = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 16 16" fill="none">
  <path d="M8.09549 7.44509L5.50833 4.85794L6.29401 4.07227L10.2224 8.00065L6.29401 11.929L5.50833 11.1433L8.09544 8.5562L3.00001 8.55626L3 7.44515L8.09549 7.44509ZM11.3334 11.8895V4.11172H12.4445V11.8895H11.3334Z" />
</svg>
