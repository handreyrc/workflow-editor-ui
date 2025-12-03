import type { Specification } from '@severlessworkflow/sdk-typescript'
import type {
  Callbackstate,
  Eventstate,
  Foreachstate,
  Injectstate,
  Operationstate,
  Parallelstate,
  Sleepstate
} from '@severlessworkflow/sdk-typescript/lib/schema/types/workflow'
import type { Switchstate } from '@severlessworkflow/sdk-typescript/lib/definitions/types'
import type { Function } from '@severlessworkflow/sdk-typescript/lib/definitions/function'

import type { Maybe, Nullable } from '$lib/types/global'

// TODO: Add/fix the rest of the types
export type WorkflowStatus = 'PENDING' | 'QUEUED'
export type WorkflowVariableState = 'open' | 'closed'

export interface WorkflowVariables {
  owner: string
  repo: string
  state: WorkflowVariableState
  per_page: number
  page: number
}

export type WorkflowState =
  Specification.Sleepstate
  | Specification.Eventstate
  | Specification.Operationstate
  | Specification.Parallelstate
  | Specification.Switchstate
  | Specification.Injectstate
  | Specification.Foreachstate
  | Specification.Callbackstate

export interface Workflow extends Specification.Workflow {
}

export interface WorkflowContent {
  workflow: Workflow
  subflows?: Array<Workflow>
  [key: string]: Maybe<Record<string, any>>
}

export interface WorkflowEntity {
  id: string
  name: string
  key: string
  content: WorkflowContent
  status: WorkflowStatus
  variables: WorkflowVariables
  mapping: Nullable<{
    id: string
    actionRef: string
  }[]>
  data: any
  project: any
  llmConfigurationId: Nullable<string>
  processInstanceId: Nullable<string>
  generatedWorkflowId: Nullable<string>
  executionTime: Nullable<string>
  completionTime: Nullable<string>
  description: string
  components: Nullable<any>
  tools: Nullable<any>
  errors: Nullable<any>
  instructions: Nullable<any>
  labels: Nullable<any>
}

export interface WorkflowUpdate extends Pick<WorkflowEntity,
  | 'content'
  | 'key'
  | 'name'
  | 'status'
  | 'description'
> {
}

export interface WorkflowChatMessage {
  from: 'AGENT' | 'USER'
  id: string
  ts?: string
  type: 'CHAT_MESSAGE' | 'LOADING'
  content: {
    message: string
    data?: Record<string, any>
  }
}

export interface DeployOperation {
  name: string
  operation: string
  configurationId: string
  referenceId: string
}
