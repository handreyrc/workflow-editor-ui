<script lang="ts">
  import cx from 'classnames'

  import { CheckIcon, CopyIcon } from '$components/icons'
  import { Button } from '$components/common/ui'


  interface Props {
    className?: string
    onClick: () => void
  }

  let { className, onClick }: Props = $props()
  let isAnimating = $state(false)

  const handleClick = () => {
    onClick?.()
    isAnimating = true

    setTimeout(() => {
      isAnimating = false
    }, 1_000)
  }

</script>

<Button
  size="small"
  type="empty"
  icon={isAnimating ? CheckIcon : CopyIcon}
  onClick={handleClick}
  className={cx(className, {
    'copyBtn': !isAnimating
  })}
  isDisabled={isAnimating}
/>

<style lang="postcss">
  :global {
    .copyBtn {
      svg {
        fill: none;
      }
    }
  }
</style>
