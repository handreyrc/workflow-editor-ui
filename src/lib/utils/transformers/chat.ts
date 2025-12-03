import { format } from 'date-fns'

import type { WorkflowChatMessage } from '$lib/types/workflows'

export const getNewMessage = (
  message: string,
  from: 'USER' | 'AGENT' = 'USER'
): WorkflowChatMessage => ({
  id: crypto.randomUUID(),
  content: {
    message,
  },
  type: 'CHAT_MESSAGE',
  from,
  ts: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")
})
