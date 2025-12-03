<script lang="ts">
  import cx from 'classnames'

  import { getProfileInitials } from '$lib/utils/profile.js'
  import { formatDate } from '$lib/utils/date.js'
  import type { WorkflowChatMessage } from '$lib/types/workflows'
  import { MarkdownParser } from '$lib/services/formatter/MarkdownParser'
  import type { Nullable } from '$lib/types'
  import type { UserProfile } from '$lib/types/user'

  import HtmlToSvelteParser from '$components/parser/HtmlToSvelteParser.svelte'
  import AvatarIcon from '$components/common/AvatarIcon.svelte'
  import ToolImage from '$components/common/ToolImage.svelte'
  import { Button } from '$components/common/ui'
  import { TrashIcon } from '$components/icons'
  import { CopyBtn } from '$components/common/buttons'

  import LoadingMessage from './LoadingMessage.svelte'

  interface Props {
    user?: Nullable<UserProfile>
    message: WorkflowChatMessage
    className?: string
  }

  let { message, user, className = '' }: Props = $props()

  const parser = new MarkdownParser()
  const getMarkdownMessage = async (message: string): Promise<string> => {
    return await parser.format({
      data: message
    })
  }

  const isUser = message.from === 'USER'
  const isAgent = message.from === 'AGENT'
</script>


<div class={cx('chat-message flex items-start space-x-2 relative max-w-full', className)} class:ml-auto={isUser}>
  {#if isAgent}
    <div class="w-8 h-8"><ToolImage iconName="openai" /></div>
  {/if}

  <div class="flex flex-col overflow-hidden">
    <div
      class="flex items-center justify-between gap-4 text-xs mb-1 font-medium"
    >
      {#if isAgent}<span>Genfusion</span>{/if}
      {#if isUser}<span class="order-1">You</span>{/if}

      {#if message.ts}
        <div class="text-textSub600 font-normal">{formatDate(message.ts, 'MM.dd.yy | HH:mm')}</div>
      {/if}
    </div>

    <div
      class={cx('p-4 rounded-[8px] break-words overflow-hidden', {
        'bg-primaryAlpha24 rounded-tr-none': isUser,
        'bg-bgSectionOnHover rounded-tl-none': isAgent,
        'bg-transparent p-2!': message.type === 'LOADING',
        'pb-5': message.type === 'CHAT_MESSAGE',
      })}
    >
      {#if message.type === 'LOADING'}
        <LoadingMessage />
      {:else}
        <div class="text-xs leading-[18px] text-textStrong950 text-wrap" class:text-black={isAgent}>
          {#await getMarkdownMessage(message?.content.message)}
            <span></span>
          {:then content}
            <HtmlToSvelteParser content={content} />
          {/await}
        </div>
      {/if}
    </div>
  </div>

  {#if user && isUser}
    <AvatarIcon nameInitials={getProfileInitials(user)} className="m-0" />
  {/if}

  {#if message.type === 'CHAT_MESSAGE'}
    <div
      class="actions hidden absolute bottom-0 right-4 translate-y-1/2 gap-1 p-1 bg-bgSection border border-primaryBase rounded-md"
      class:right-12={isUser}
    >
      <Button
        size="small"
        type="empty"
        icon={TrashIcon}
        onClick={() => {}}
      />

      <CopyBtn
        onClick={() => navigator.clipboard?.writeText?.(message.content.message)}
      />
    </div>
  {/if}
</div>

<style lang="postcss">
  .chat-message {
    &:hover {
      .actions {
        display: flex;
      }
    }

    :global {
      .codeBlock .code {
        max-height: 400px;
      }
    }
  }
</style>
