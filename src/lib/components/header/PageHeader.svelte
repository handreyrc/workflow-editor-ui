<script lang="ts">
  import type { Snippet } from 'svelte'
  import cx from 'classnames'

  interface Props {
    className?: string
    breadcrumbs?: Snippet
    content?: Snippet
  }

  let { className = '', breadcrumbs, content }: Props = $props()
</script>

<header id="header" class={cx('bg-bgSection flex justify-between items-center shrink-0 h-[64px] px-4 border-b border-b-strokeSoft200', className)}>
  {@render breadcrumbs?.()}
  {@render content?.()}
</header>
