<script lang="ts">
  interface Props {
    label?: string;
    color: any;
  }

  let { label = '', color }: Props = $props();

  const hexToRGBA = (hex: string, opacity: number) => {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

    // TODO: just refactored, no logic change
</script>

<span
  class="tag inline-flex items-center justify-center w-fit h-9 px-4 text-[14px] rounded-full text-center mx-1"
  style="background-color: {hexToRGBA(color, 0.1)}; color: {color};"
>
  {label}
</span>
