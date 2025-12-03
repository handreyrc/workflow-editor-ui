<script lang="ts">
  import cx from 'classnames'
  import { type Snippet, tick } from 'svelte'

  import type { UserProfile } from '$lib/types/user'
  import type { Maybe, Nullable } from '$lib/types'
  import type { WorkflowChatMessage } from '$lib/types/workflows'

  import { PaperPlaneIcon } from '$components/icons'
  import Spinner from '$components/common/Spinner.svelte'

  import Message from './Message.svelte'

  type ScrollLogicalPosition = 'start' | 'center' | 'end' | 'nearest'
  interface Props {
    isOpen?: boolean
    className?: string
    inputClassName?: string
    messages?: WorkflowChatMessage[]
    user: Nullable<UserProfile>
    isLoading?: boolean
    isAnswering?: boolean
    onSendMessage: (message: string) => void
    empty?: Snippet
    textareaFooter?: Snippet
    thinkingMessage: Maybe<WorkflowChatMessage>
  }

  let {
    isOpen,
    className = '',
    inputClassName = '',
    messages = [],
    user,
    isLoading = false,
    isAnswering = false,
    onSendMessage,
    empty,
    textareaFooter,
    thinkingMessage
  }: Props = $props()

  let textarea: Maybe<HTMLTextAreaElement> = $state()
  let lastMessageElement: Maybe<HTMLDivElement> = $state()
  let bottomRef: Maybe<HTMLElement> = $state()
  let lastMessageId = $state<Nullable<string>>(null)

  let newMessage = $state('')
  let isFirstRender = true

  const scrollToLastMessage = async (
    block: ScrollLogicalPosition = 'start',
    timeout = 0,
    behavior: 'smooth' | 'auto' = 'smooth'
  ) => {
    await tick()
    setTimeout(() => {
      if (block === 'end' && behavior === 'auto') {
        bottomRef?.scrollIntoView({ behavior, block })
        return
      }

      lastMessageElement?.scrollIntoView({ behavior, block })
    }, timeout)
  }

  const sendMessage = () => {
    if (isLoading) return

    if (newMessage.trim() !== '') {
      onSendMessage(newMessage)
      newMessage = ''
      adjustTextareaHeight(true)
      scrollToLastMessage()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const adjustTextareaHeight = (clear = false) => {
    if (textarea) {
      textarea.style.height = 'auto'

      if (!clear) {
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    }
  }

  const setLastMessageRef = (element: HTMLDivElement | null, is: boolean) => {
    if (is && element) {
      lastMessageElement = element
    }
  }

  $effect(() => {
    if (messages.length) {
      textarea?.focus()

      if (isOpen && isFirstRender) {
        scrollToLastMessage('end', 0, 'auto')
        isFirstRender = false
        return
      }

      const lastMessage = messages[messages.length - 1]
      if (thinkingMessage || isAnswering || lastMessageId !== lastMessage.id) {
        scrollToLastMessage()
      }
    }

    lastMessageId = messages.length ? messages[messages.length - 1].id : null
  })
</script>

<div
  class={cx('w-full h-full bg-bgSection flex flex-col grow', className)}
>
  <div class="flex-1 flex flex-col min-h-0">
    {#if messages.length === 0}
      <div class="flex items-center justify-center h-full">
        {@render empty?.()}
      </div>
    {:else}
      <div class="p-4 overflow-y-auto flex flex-col grow min-h-0 space-y-2">
        {thinkingMessage}
        <div class="flex flex-col mt-auto space-y-2">
          {#each messages as message, index (message.id)}
            {@const isLastMessage = index === messages.length - 1}
            <div class="py-2 flex" use:setLastMessageRef={isLastMessage}>
              <Message user={user} message={message} />
            </div>
          {/each}
          {#if isAnswering}
            {#if thinkingMessage}
              <div class="py-2 flex" use:setLastMessageRef={true}>
                <Message message={thinkingMessage} className="animate-pulse" />
              </div>
            {:else}
              <div class="py-2 flex" use:setLastMessageRef={true}>
                <Message
                  message={{
                    id: 'loading',
                    from: 'AGENT',
                    type: 'LOADING',
                    content: { message: '' },
                  }}
                />
              </div>
            {/if}
          {/if}
          <span bind:this={bottomRef}></span>
        </div>
      </div>
    {/if}

    <div class="relative mx-4 mb-4 shrink-0 bg-pageBg border border-strokeSoft200 rounded-[8px] overflow-hidden">
      <textarea
        bind:value={newMessage}
        bind:this={textarea}
        onkeydown={handleKeyDown}
        oninput={() => adjustTextareaHeight()}
        placeholder="Describe your workflow…"
        class={cx(inputClassName, 'flex-1 p-3 scroll-pb-3 min-h-24 max-h-[300px] w-full text-sm outline-hidden font-poppins resize-none')}
      ></textarea>
      <div class="flex items-center justify-between p-2">
        <div>{@render textareaFooter?.()}</div>
        <button
          onclick={sendMessage}
          class="center rounded-full w-6 h-6 text-staticWhite transition-colors"
          class:bg-bgSoft200={!newMessage || isLoading}
          class:text-textDisabled300={!newMessage || isLoading}
          class:bg-primaryBase={newMessage && !isLoading}
          disabled={isLoading}
        >
          {#if isLoading}
            <div class="w-full h-full p-2"><Spinner /></div>
          {:else}
            <PaperPlaneIcon width={16} height={16} />
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
