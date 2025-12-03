<script lang="ts">
  interface Props {
    width?: number
    height?: number
  }

  let { width = 20, height = 20 }: Props = $props()
</script>


<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 16 16" fill="none">
  <path d="M8.00004 8.70242L10.97 5.73242L11.8184 6.58082L8.00004 10.3992L4.18164 6.58082L5.03004 5.73242L8.00004 8.70242Z" />
</svg>
