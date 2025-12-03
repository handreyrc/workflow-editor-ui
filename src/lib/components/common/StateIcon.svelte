<script lang="ts">
  import type { Maybe } from '$lib/types'

  import {
    ArrowSplitIcon,
    LightningIcon,
    RepeatIcon,
    SyringeIcon,
    TimerFlashIcon,
    TimerIcon,
    TwoArrowsRight,
    UserSoundIcon,
    RefreshLineIcon
  } from '$components/icons'

  interface Props {
    type?: Maybe<string>
    width?: number
    height?: number
  }

  let { type = '', width, height }: Props = $props()
</script>

{#if type === 'operation'}<LightningIcon {width} {height} />{/if}
{#if type === 'event'}<TimerFlashIcon {width} {height} />{/if}
{#if type === 'foreach'}<RepeatIcon {width} {height} />{/if}
{#if type === 'sleep'}<TimerIcon {width} {height} />{/if}
{#if type === 'inject'}<SyringeIcon {width} {height} />{/if}
{#if type === 'parallel'}<TwoArrowsRight {width} {height} />{/if}
{#if type === 'switch'}<ArrowSplitIcon {width} {height} />{/if}
{#if type === 'callback'}<UserSoundIcon {width} {height} />{/if}
{#if type === 'subflow'}<RefreshLineIcon {width} {height} />{/if}
