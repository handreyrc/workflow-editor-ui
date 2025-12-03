<script lang="ts">
  import cx from 'classnames'

  import { GitHubIcon, DeepSeekIcon, GenFusionIcon, OpenAIIcon } from '$components/icons/tools'

  import SlackIconSrc from '$assets/images/tools/slack.svg'
  import GoogleCalendarSrc from '$assets/images/tools/google_calendar.svg'
  import GoogleDriveSrc from '$assets/images/tools/google_drive.svg'
  import AzureAISrc from '$assets/images/tools/azure_ai.svg'

  interface Props {
    iconName?: string
    className?: string
  }

  const { iconName = '', className = '' }: Props = $props()

  const name = iconName
    ?.replace(/\.yml$/, '')
    .replace(/\.yaml$/, '')
    .toLowerCase()
</script>

{#if name === 'github'}
  <GitHubIcon />

{:else if name === 'openai' || name === 'open-ai' || name === 'dall-e'}
  <OpenAIIcon />

{:else if name === 'deepseek'}
  <DeepSeekIcon />

{:else if name === 'azure openai'}
  <img src={AzureAISrc} alt="" class={cx(className)} />

{:else if name === 'slack'}
  <img src={SlackIconSrc} alt="" class={cx(className)} />

{:else if name === 'google-calendar'}
  <img src={GoogleCalendarSrc} alt="" class={cx(className)} />

{:else if name === 'google-drive' || name === 'googledrive'}
  <img src={GoogleDriveSrc} alt="" class={cx(className)} />

{:else}
  <GenFusionIcon />
{/if}
