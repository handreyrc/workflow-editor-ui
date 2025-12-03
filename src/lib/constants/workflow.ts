import type { WorkflowState } from '$lib/types/workflows'

interface WorkflowOperation {
  title: string
  type: Exclude<WorkflowState['type'], undefined>
  description: string
}

const EVENT_OPERATION: WorkflowOperation = {
  title: 'Event',
  type: 'event',
  description: 'Define events that trigger action execution.'
}

const TASK_OPERATION: WorkflowOperation = {
  title: 'Operation',
  type: 'operation',
  description: 'Execute one or more actions.'
}

const DECISION_OPERATION: WorkflowOperation = {
  title: 'Decision',
  type: 'switch',
  description: 'Define data-based or event-based workflow transitions.'
}

const DELAY_OPERATION: WorkflowOperation = {
  title: 'Sleep',
  type: 'sleep',
  description: 'Sleep workflow execution for a specific time duration.'
}

const PARALLEL_OPERATION: WorkflowOperation = {
  title: 'Parallel',
  type: 'parallel',
  description: 'Causes parallel execution of branches (set of states).'
}

const DATA_OPERATION: WorkflowOperation = {
  title: 'Inject',
  type: 'inject',
  description: 'Inject static data into state data'
}

const ITERATION_OPERATION: WorkflowOperation = {
  title: 'For Each',
  type: 'foreach',
  description: 'Parallel execution of states for each element of a data array.'
}

const MANUAL_OPERATION: WorkflowOperation = {
  title: 'Callback',
  type: 'callback',
  description: 'Manual decision step. Executes a function and waits for callback event that indicates completion of the manual decision.'
}

export const WORKFLOW_OPERATIONS = {
  event: EVENT_OPERATION,
  operation: TASK_OPERATION,
  switch: DECISION_OPERATION,
  sleep: DELAY_OPERATION,
  parallel: PARALLEL_OPERATION,
  inject: DATA_OPERATION,
  foreach: ITERATION_OPERATION,
  callback: MANUAL_OPERATION
}
