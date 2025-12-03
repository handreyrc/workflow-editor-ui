<script lang="ts">
  interface Props {
    width?: number;
    height?: number;
  }

  let { width = 20, height = 20 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 20 20" fill="none">
  <path d="M12.25 9.5L16 6.25039L12.25 3L11.227 3.59839L13.129 5.50114L3.25 5.50039L3.25 7.00039L13.129 7.00039L11.227 8.90239L12.25 9.5ZM12.25 17.2667L11.227 16.4024L13.129 14.5004L3.25 14.5004L3.25 13.0004L13.129 13.0004L11.227 11.0984L12.2875 10.5L16 13.7504L12.25 17.2667Z" />
</svg>
