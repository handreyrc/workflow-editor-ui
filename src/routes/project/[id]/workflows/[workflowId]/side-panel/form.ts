import { Specification } from '@severlessworkflow/sdk-typescript'

export const initializeValues = (workflow: Specification.Workflow) => {
  return {
    id: workflow?.id,
    key: workflow?.key,
    name: workflow?.name,
    start: typeof workflow?.start !== 'object' ? workflow.start : undefined,
    description: workflow?.description,
    version: workflow?.version || '1',
    annotations: workflow?.annotations,
    dataInputSchema: workflow?.dataInputSchema ? JSON.stringify(workflow.dataInputSchema, null, 2) : undefined,
    secrets: workflow?.secrets ? JSON.stringify(workflow.secrets, null, 2) : undefined,
    constants: workflow?.constants ? JSON.stringify(workflow.constants, null, 2) : undefined,
    metadata: workflow?.metadata ? JSON.stringify(workflow.metadata, null, 2) : undefined,
    timeouts: workflow.timeouts && typeof workflow.timeouts === 'object' ? {
      workflowExecTimeout: workflow?.timeouts?.workflowExecTimeout,
      eventTimeout: workflow?.timeouts?.eventTimeout
    } : {},
    functions: workflow?.functions || [],
    errors: workflow?.errors || [],
  }
}
