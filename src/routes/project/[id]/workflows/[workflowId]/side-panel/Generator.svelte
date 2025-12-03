<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte'

  import { page } from '$app/state'

  import { theme, Theme } from '$lib/services/themeService'
  import type { WorkflowChatMessage } from '$lib/types/workflows'
  import { userProfile } from '$lib/stores/authStore'
  import type { Maybe } from '$lib/types'
  import SocketService from '$lib/services/socketService'
  import { getUrl } from '$lib/utils/url'
  import { BASE_URLS } from '$lib/constants/url'
  import { ApiEndpoints } from '$lib/constants/api'
  import { getAuthToken } from '$lib/services/authService'
  import { setIsWorkflowSaved } from '$lib/stores/workflowStore'
  import { WORKFLOW_DATA_CONTEXT, type WorkflowDataContext } from '$lib/types/context/workflow'
  import { getNewMessage } from '$lib/utils/transformers/chat'

  import Chat from '$components/chat/Chat.svelte'

  import EmptyWorkflowsLightIcon from '$assets/images/emptyworkflow_light.svg'
  import EmptyWorkflowsIcon from '$assets/images/emptyworkflow.svg'

  interface Props {
    isOpen: boolean
    onWorkflowGenerate: () => void
    isChatConnected?: boolean
  }

  let { isOpen,
    onWorkflowGenerate,
    isChatConnected = $bindable()
  }: Props = $props()

  let projectId = page.params?.id
  let workflowId = page.params?.workflowId

  let messages: WorkflowChatMessage[] = $state([])
  let socket: Maybe<SocketService> = $state()
  let isLoading = $state(false)
  let isAnswering = $state(false)
  let thinkingMessage: Maybe<WorkflowChatMessage> = $state(undefined)

  const workflowDataContext: WorkflowDataContext = getContext(WORKFLOW_DATA_CONTEXT)

  onMount(() => {
    const endpoint = getUrl(BASE_URLS.BASE_URL_WORKFLOW_GENERATOR, ApiEndpoints.PROJECTS, projectId, ApiEndpoints.WORKFLOWS, workflowId, 'chat')
    const quarkusHeaderProtocol = encodeURIComponent('quarkus-http-upgrade#Authorization#Bearer ' + getAuthToken())

    socket = new SocketService(
      endpoint,
      {
        protocols: ['bearer-token-carrier', quarkusHeaderProtocol],
        reconnect: true,
        protocolOnReconnect: () => {
          const quarkusHeaderProtocol = encodeURIComponent('quarkus-http-upgrade#Authorization#Bearer ' + getAuthToken())
          return ['bearer-token-carrier', quarkusHeaderProtocol]
        },
        onChangeConnection: (isConnected: boolean) => {
          isChatConnected = isConnected
        }
      }
    )

    attachEventListeners()
    socket.onClientRecreated = attachEventListeners
  })

  onDestroy(() => {
    if (socket) {
      socket.onClientRecreated = null

      try {
        socket.client.removeEventListener('message', handleMessageReceived)
        socket.client.removeEventListener('error', handleErrorReceived)
      } catch {
        //
      }

      socket.client.close()
    }
  })

  const attachEventListeners = () => {
    // Remove any existing listeners to avoid duplicates
    try {
      socket?.client.removeEventListener('message', handleMessageReceived)
      socket?.client.removeEventListener('error', handleErrorReceived)
    } catch {
      //
    }

    socket?.client.addEventListener('message', handleMessageReceived)
    socket?.client.addEventListener('error', handleErrorReceived)
  }

  const handleMessageReceived = (e: MessageEvent) => {
    const data = JSON.parse(e.data)
    thinkingMessage = undefined

    if (Array.isArray(data)) {
      messages = data.reverse()
      isLoading = false
      return
    }

    if (data.inline) {
      thinkingMessage = {
        ...data,
        from: 'AGENT',
        ts: undefined
      }

      return
    }

    isAnswering = false
    messages = [...messages, data]

    if (data.content?.data?.workflow) {
      setIsWorkflowSaved(false)
      workflowDataContext.setData(data.content.data.workflow, data.content.data.subflows || [])
      onWorkflowGenerate()
    }
    isLoading = false
  }

  const handleErrorReceived = (e: Event) => {
    isLoading = false
    isAnswering = false
  }

  const handleSendMessage = async (message: string) => {
    const newMessage = getNewMessage(message)
    messages = [...messages, newMessage]

    isLoading = true
    isAnswering = true

    try {
      // Wait for the message to be sent
      await socket?.send(JSON.stringify({
        message,
      }))
    } catch (error) {
      isLoading = false
      isAnswering = false

      messages = [...messages, getNewMessage('Failed to send message. Please try again later.', 'AGENT')]
    }
  }
</script>

<Chat
  isLoading={isLoading}
  isAnswering={isAnswering}
  messages={messages}
  user={$userProfile}
  onSendMessage={handleSendMessage}
  isOpen={isOpen}
  thinkingMessage={thinkingMessage}
>
  {#snippet empty()}
    <div class="center flex-col p-12">
      <img src={$theme === Theme.Dark ? EmptyWorkflowsIcon : EmptyWorkflowsLightIcon} alt="empty messages" />
      <p class="text-textStrong950 mt-6">Let’s build something together</p>
      <p class="text-center text-textSub600 text-sm mt-2">
        Tell me what you want to automate - I’ll turn it into a workflow, and show you the code too.
      </p>
    </div>
  {/snippet}
</Chat>
