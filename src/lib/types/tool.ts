import type { Nullable } from '$lib/types/global'

export interface ToolVariable {
  name: string
  label: string
  type: string
  value: string
  required: boolean
  tooltip: string
}

export enum ToolType {
  OAUTH2_TOKEN = 'OAUTH2_TOKEN',
  OPENAI_CREDENTIALS = 'OPENAI_CREDENTIALS',
  CLIENT_KEY_CLIENT_SECRET = 'CLIENT_KEY_CLIENT_SECRET',
  BASIC_AUTH = 'BASIC_AUTH',
  NONE = 'NONE'
}

export interface Tool {
  createdAt?: string
  deleted?: boolean
  description: string
  global: boolean
  id: string
  link: string
  name: string
  label: string
  owner: string
  schema?: string
  updatedAt?: Nullable<string>
  version?: number
  variables?: ToolVariable[]
  type: string
  format: ToolType
  status: 'READY' | 'PENDING_IMPORT' | 'IMPORT_PARTIAL_SUCCESS'
}

export interface CreateTool {
  credentials: ToolType
  isGlobal: boolean
  link?: string
  name: string
}

export interface CreateToolBySchema extends CreateTool {
  schema: string
}

export interface CreateToolByUrl extends CreateTool {
  url: string
}

export interface ConfigurationValue {
  baseUrl?: string
  token?: string
}

export interface Configuration {
  id: string
  name: string
  toolName: string
  type: string
  value: ConfigurationValue
  format: string
  schema: string
  referenceId: string
  createdAt: string
  deleted: boolean
  updatedAt: Nullable<string>
}
