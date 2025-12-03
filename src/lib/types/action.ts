import type { Nullable } from '$lib/types/global'
import type { Tool } from '$lib/types/tool'

export interface MetaValue {
  tool?: string
  type?: string
}
export interface Response {
  result?: object
}

export interface Answer {
  name?: string
  response?: Response
}
export interface Action {
  id: string
  name: string
  type: string
  description: string
  label: string
  guidelines : string
  answer: Answer,
  tool: Tool,
  metadata:MetaValue
  createdAt: string,
  deleted: boolean,
  updatedAt: Nullable<string>
}

