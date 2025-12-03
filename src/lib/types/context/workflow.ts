import type { Specification } from '@severlessworkflow/sdk-typescript'
import type { Writable } from 'svelte/store'
import type { Node } from '@xyflow/svelte'

export const WORKFLOW_FORM_CONTEXT = 'WORKFLOW_FORM_CONTEXT'
export interface WorkflowFormContext {
  isDisabled: boolean
}

export const WORKFLOW_DATA_CONTEXT = 'WORKFLOW_DATA_CONTEXT'
export interface WorkflowDataContext {
  workflow: Writable<Specification.Workflow>
  subflows: Writable<Array<Specification.Workflow>>
  nodes: Writable<Array<Node>>
  setData: (workflow: Specification.Workflow, subflows: Array<Specification.Workflow>) => void
  updateWorkflow: (workflow: Specification.Workflow) => void
  addSubflow: (subflow: Specification.Workflow) => void
  updateSubflows: (subflows: Array<Specification.Workflow>) => void
  updateSubflowById: (id: string, subflow: Specification.Workflow, isAddNew?: boolean) => void
  deleteSubflowById: (id: string) => void
  clear: () => void
}
