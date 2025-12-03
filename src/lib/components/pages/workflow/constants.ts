export const actionModeOptions = [
  { id: 'sequential', value: 'sequential', label: 'Sequentially' },
  { id: 'parallel', value: 'parallel', label: 'Parallel' },
]

export const completionTypeOptions = [
  { id: 'allOf', value: 'allOf', label: 'All of' },
  { id: 'atLeast', value: 'atLeast', label: 'At least' },
]

export const actionTypeOptions = [
  { id: 'function', value: 'function', label: 'Function' },
  { id: 'event', value: 'event', label: 'Event' },
  { id: 'subflow', value: 'subflow', label: 'Subflow' },
]

export const invokeOptions = [
  { id: 'sync', value: 'sync', label: 'Sync' },
  { id: 'async', value: 'async', label: 'Async' },
]
