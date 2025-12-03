import { Specification } from '@severlessworkflow/sdk-typescript'

export const getEmptyWorkflowDefinition = (key?: string) => {
  return {
    id: key || '',
    specVersion: '0.0.8',
    version: '1.0'
  } as Specification.Workflow
}
