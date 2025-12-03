import { Specification } from '@severlessworkflow/sdk-typescript'

import type { WorkflowState } from '$lib/types/workflows'
import { isValidISO8601Date } from '$lib/utils/workflow/validators'

export const getStateValues = (state: WorkflowState) => {
  const values: Record<string, any> = {
    name: state?.name,
    id: state?.id,
    compensatedBy: state?.compensatedBy,
    stateDataFilter: {
      input: state.stateDataFilter?.input,
      output: state.stateDataFilter?.output,
    },
    metadata: state.metadata ? JSON.stringify(state.metadata) : undefined,
  }

  if ('actionMode' in state) {
    values.actionMode = state.actionMode
  }

  if ('mode' in state) {
    values.mode = state.mode
  }

  if (state.type !== 'switch') {
    values.end = state.end || false
  }

  if ('exclusive' in state) {
    values.exclusive = state.exclusive
  }

  if ('usedForCompensation' in state) {
    values.usedForCompensation = state.usedForCompensation || false
  }

  if ('defaultCondition' in state) {
    values.defaultCondition = state.defaultCondition || {}
  }

  if ('dataConditions' in state) {
    values.dataConditions = state.dataConditions
  }

  if ('eventConditions' in state) {
    values.eventConditions = state.eventConditions
  }

  if (state instanceof Specification.Sleepstate) {
    values.duration = state.duration
  }

  values.timeouts = {
    stateExecTimeout: state.timeouts?.stateExecTimeout,
  }

  if (state instanceof Specification.Eventstate) {
    values.timeouts.eventTimeout = state.timeouts?.eventTimeout
  }

  if (state instanceof Specification.Injectstate) {
    values.data = state.data || {}
  }

  if (state instanceof Specification.Parallelstate) {
    values.completionType = state.completionType
    values.numCompleted = state.numCompleted
    values.branches = state.branches || []
  }

  if (state instanceof Specification.Foreachstate) {
    values.inputCollection = state.inputCollection
    values.outputCollection = state.outputCollection
    values.iterationParam = state.iterationParam
    values.batchSize = state.batchSize
  }

  if (!(state instanceof Specification.Databasedswitchstate) && !(state instanceof Specification.Eventbasedswitchstate)) {
    values.transition = state.transition
  }

  if (
    state instanceof Specification.Operationstate
    || state instanceof Specification.Foreachstate
  ) {
    values.actions = state.actions || []
  }

  if (state instanceof Specification.Callbackstate) {
    values.action = state.action
    values.eventRef = state.eventRef
  }

  if (!(state instanceof Specification.Injectstate)) {
    values.onErrors = state.onErrors || [] as Specification.Error[]
  }

  return values
}

export const validateForm = (values: Record<string, any>) => {
  const errors: Record<string, string> = {}
  if (!values.name) errors.name = 'Name is required'

  if (values.duration && !isValidISO8601Date(values.duration)) {
    errors.duration = 'Invalid ISO 8601 duration format'
  }

  if ('transition' in values) {
    if (!values.end && !values.transition) {
      errors.transition = 'Transition is required'
    }
  }

  if (values.defaultCondition) {
    if (!values.defaultCondition.end && !values.defaultCondition.transition) {
      errors['defaultCondition.transition'] = 'Transition or end is required for default condition'
    }
  }

  if (values.metadata) {
    try {
      const metadata = JSON.parse(values.metadata)
      if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
        errors.metadata = 'Invalid JSON format for metadata'
      }
    } catch {
      errors.metadata = 'Invalid JSON format for metadata'
    }
  }

  if (values.timeouts) {
    if (values.timeouts.stateExecTimeout && !isValidISO8601Date(values.timeouts.stateExecTimeout)) {
      errors['timeouts.stateExecTimeout'] = 'Invalid ISO 8601 duration format for state execution timeout'
    }
    if (values.timeouts.eventTimeout && !isValidISO8601Date(values.timeouts.eventTimeout)) {
      errors['timeouts.eventTimeout'] = 'Invalid ISO 8601 duration format for event timeout'
    }
  }

  if ('action' in values && !values.action) {
    errors.action = 'Action is required'
  }

  // TODO: add validation after supporting events
  // if ('eventRef' in values && !values.eventRef) {
  //   errors.eventRef = 'Event reference is required'
  // }

  return errors
}


export const getActionRefName = (action: Specification.Action) => {
  if (action.functionRef && typeof action.functionRef !== 'string') {
    return action.functionRef.refName as string
  }

  return ''
}

export const getActionType = (action?: Specification.Action) => {
  if (!action) return undefined

  if (action.functionRef) return 'function'
  if (action.eventRef) return 'event'
  if (action.subFlowRef) return 'subflow'
}

export const getStateDefinition = (data: Record<string, any>) => {
  return {
    ...data,
    end: data.end || undefined,
    metadata: data.metadata ? JSON.parse(data.metadata) : undefined
  }
}
