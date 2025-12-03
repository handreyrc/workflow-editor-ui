<script lang="ts">
  interface Props {
    width?: number;
    height?: number;
  }

  let { width = 20, height = 20 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 7 10" fill="none">
  <path d="M2.70425 4.99924L6.41675 8.71174L5.35625 9.77224L0.583252 4.99924L5.35625 0.226242L6.41675 1.28674L2.70425 4.99924Z" />
</svg>
