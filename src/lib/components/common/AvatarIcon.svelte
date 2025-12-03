<script lang="ts">
  import cx from 'classnames'

  interface Props {
    nameInitials: string
    className?: string
  }

  let { nameInitials, className = '' } = $props()
</script>

<span
  class={cx('border-none rounded-full flex items-center justify-center w-8 h-8 bg-purple-200 text-purple-950 shrink-0', className)}
>
    <span class="text-xs">{nameInitials}</span>
</span>
