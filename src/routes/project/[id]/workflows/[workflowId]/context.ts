import { writable } from 'svelte/store'
import { Specification } from '@severlessworkflow/sdk-typescript'

import type { WorkflowDataContext } from '$lib/types/context/workflow'

export const workflowDataContext: WorkflowDataContext = {
  workflow: writable(),
  subflows: writable([]),
  nodes: writable([]),
  setData: (newWorkflow, newSubflows) => {
    workflowDataContext.workflow.set(newWorkflow)
    workflowDataContext.subflows.set(newSubflows)
  },
  updateWorkflow: (newWorkflow) => {
    workflowDataContext.workflow.set(newWorkflow)
  },
  addSubflow: (newSubflow: Specification.Workflow) => {
    workflowDataContext.subflows.update((current) => [...current, newSubflow])
  },
  updateSubflows: (newSubflows) => {
    workflowDataContext.subflows.set(newSubflows)
  },
  updateSubflowById: (id, newSubflow, addNew = false) => {
    workflowDataContext.subflows.update((current) => {
      const index = current.findIndex((sf) => sf.id === id)
      if (index !== -1) {
        const updated = [...current]
        updated[index] = newSubflow
        return updated
      }

      if (addNew) {
        return [...current, newSubflow]
      }

      return current
    })
  },
  deleteSubflowById: (id) => {
    workflowDataContext.subflows.update((current) => current.filter((sf) => sf.id !== id))
  },
  clear: () => {
    workflowDataContext.workflow.set({} as Specification.Workflow)
    workflowDataContext.subflows.set([])
  }
}
