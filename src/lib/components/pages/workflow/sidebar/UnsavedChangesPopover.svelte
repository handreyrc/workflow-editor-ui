<script lang="ts">
  import cx from 'classnames'

  import type { Maybe } from '$lib/types'

  import { Button, Popover } from '$components/common/ui'

  interface Props {
    popover: Maybe<string>
    onDiscard: () => void
    arrowClassName?: string
  }

  let {
    arrowClassName = '',
    popover = $bindable(),
    onDiscard
  }: Props = $props()
</script>

<Popover
  isOpen={!!popover}
  onOpenChange={() => popover = undefined}
  positioning={{
    placement: 'bottom-start',
  }}
>
  {#snippet button()}
    <span class=""></span>
  {/snippet}
  {#snippet arrow()}
    <span class={cx(arrowClassName, 'w-3 h-3 bg-pageBg absolute top-2.5 left-8 rotate-45 border-t border-l border-strokeSoft200')}></span>
  {/snippet}
  <div class="bg-pageBg rounded-lg p-4 w-80 border border-strokeSoft200 mr-2 mt-4">
    <div class="text-xs">You have not saved changes.</div>
    <div class="flex items-center justify-between mt-4">
      <Button
        type="secondary"
        onClick={onDiscard}
        size="small"
      >
        Discard
      </Button>
      <Button size="small" onClick={() => popover = undefined}>Cancel</Button>
    </div>
  </div>
</Popover>
