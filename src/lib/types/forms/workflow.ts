import { Specification } from '@severlessworkflow/sdk-typescript'

import type { Maybe } from '$src/lib/types'

export interface WorkflowForm {
  id: Maybe<string>,
  key: Maybe<string>,
  name: Maybe<string>,
  start: Maybe<string>,
  description: Maybe<string>,
  version: Maybe<string>,
  annotations: Maybe<string[]>,
  dataInputSchema: Maybe<string>,
  secrets: Maybe<string>,
  constants: Maybe<string>,
  metadata: Maybe<string>,
  timeouts: Maybe<{
    stateExecTimeout?: string | undefined,
    workflowExecTimeout?: Specification.WorkflowExecTimeout | undefined
    actionExecTimeout?: string | undefined
    branchExecTimeout?: string | undefined
    eventTimeout?: string | undefined
  }>
  errors: Maybe<Specification.Errordef[]>,
  functions: Maybe<Specification.Function[]>,
}
