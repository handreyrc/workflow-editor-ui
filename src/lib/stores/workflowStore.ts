import { derived, writable } from 'svelte/store'

import type { Nullable, PagePagination, Paginated } from '$lib/types'
import type { DeployOperation, WorkflowEntity, WorkflowChatMessage, WorkflowUpdate } from '$lib/types/workflows'
import { BASE_URLS } from '$lib/constants/url'
import { getUrl } from '$lib/utils/url'
import { ApiEndpoints } from '$lib/constants/api'
import { apiService } from '$lib/services/apiService'
import { showErrorMessage, showSuccessMessage } from '$lib/stores/toastsStore'
import workflowResp from '$lib/__mocks__/workflow-response-with-subflow.json'
import chatResponse from '$lib/__mocks__/parser_example.txt?raw'
import type { Project } from '../types/project'

export interface WorkflowStore {
  chat: any
  data: Paginated<WorkflowEntity[]>
  isGenerating: boolean
  isSaved: boolean
}

export interface SelectedWorkflowStore {
  selectedWorkflow: Nullable<WorkflowEntity>
}

export const workflowStore = writable<WorkflowStore>({
  chat: null,
  data: {
    items: [],
    totalCount: 0
  },
  isGenerating: false,
  isSaved: true
})

export const selectedWorkflowStore = writable<SelectedWorkflowStore>({
  selectedWorkflow: null,
})

// selectors
export const workflowsSelector = derived(workflowStore, ($workflowStore) => $workflowStore)
export const workflowsDataSelector = derived(workflowStore, ($workflowStore) => $workflowStore.data)
export const workflowsSelectedWorkflowSelector  = derived(selectedWorkflowStore, ($workflowStore) => $workflowStore.selectedWorkflow)
export const workflowChatSelector = () => derived(workflowStore, ($workflowStore) => $workflowStore.chat)

// reducers

export const setIsGenerating = (isGenerating: boolean) => {
  workflowStore.update((store) => {
    store.isGenerating = isGenerating
    return store
  })
}

export const setWorkflows = (data: Paginated<WorkflowEntity[]>) => {
  workflowStore.update((store) => {
    store.data = data
    return store
  })
}

export const setSelectedWorkflow = (workflow: Nullable<WorkflowEntity>) => {
  selectedWorkflowStore.update((store) => {
    store.selectedWorkflow = workflow
    return store
  })
}

export const setIsWorkflowSaved = (isSaved: boolean) => {
  workflowStore.update((store) => {
    store.isSaved = isSaved
    return store
  })
}

export const updateSelectedWorkflow = (workflow: Partial<WorkflowEntity>) => {
  selectedWorkflowStore.update((store) => {
    store.selectedWorkflow = {
      ...store.selectedWorkflow,
      ...workflow
    } as WorkflowEntity
    return store
  })
}

// actions
export const getWorkflowsAction = async (projectId: string, pagination?: PagePagination)=> {
  // const endpoint = getUrl(
  //   BASE_URLS.BASE_URL_PROJECT,
  //   ApiEndpoints.PROJECTS,
  //   projectId,
  //   ApiEndpoints.WORKFLOWS
  // )

  //handrey
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.WORKFLOWS
  )

  const { page = 0, size = 20 } = pagination || {}

  try {
    console.log("handrey --> getting workflows...");
    //const data = await apiService<Paginated<WorkflowEntity[]>>({ endpoint: `${endpoint}?page=${page}&size=${size}` })

    //handrey
    const workflows: WorkflowEntity[] =  await apiService<WorkflowEntity[]>({ endpoint })

    const data: Paginated<WorkflowEntity[]> = {
      "totalCount": workflows.length,
      items: workflows
    }

    setWorkflows(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })
    return []
  }
}

export const getWorkflowInfoAction = async (projectId: string, workflowId: string) => {
  //   const endpoint = getUrl(
  //   BASE_URLS.BASE_URL_PROJECT,
  //   ApiEndpoints.PROJECTS,
  //   projectId,
  //   ApiEndpoints.WORKFLOWS,
  //   workflowId
  // )

    //handrey
    const endpoint = getUrl(
      BASE_URLS.BASE_URL_PROJECT,
      ApiEndpoints.WORKFLOWS,
      workflowId
    )

  try {
    //handrey
    const data =  await apiService<WorkflowEntity>({ endpoint })

    setSelectedWorkflow(data)
    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const createWorkflowAction = async (projectId: string, workflow: WorkflowEntity) => {
  // const endpoint = getUrl(
  //   BASE_URLS.BASE_URL_PROJECT,
  //   ApiEndpoints.PROJECTS,
  //   projectId,
  //   ApiEndpoints.WORKFLOWS
  // )

  // try {
  //   return await apiService<WorkflowEntity>({
  //     endpoint,
  //     method: 'POST',
  //     body: workflow
  //   })
  // } catch (_error) {
  //   const error = _error as Error
  //   showErrorMessage({ description: error.message })

  //   return null
  // }


    //handrey
    const endpoint = getUrl(
      BASE_URLS.BASE_URL_PROJECT,
      ApiEndpoints.WORKFLOWS,
      "1"
    )

    try {
    //handrey
    const data =  await apiService<WorkflowEntity>({ endpoint })

    setSelectedWorkflow(data)
    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const updateWorkflowAction = async (
  projectId: string,
  workflowId: string,
  workflow: WorkflowUpdate
) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId,
    ApiEndpoints.WORKFLOWS,
    workflowId
  )

  try {
    const data =  await apiService<WorkflowEntity>({
      endpoint,
      method: 'PUT',
      body: workflow
    })

    showSuccessMessage({ description: 'The workflow has been successfully saved' })
    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const deleteWorkflowAction = async (projectId: string, workflowId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId,
    ApiEndpoints.WORKFLOWS,
    workflowId
  )

  try {
    await apiService<WorkflowEntity>({
      endpoint,
      method: 'DELETE'
    })

    showSuccessMessage({ description: 'The workflow has been deleted' })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const executeWorkflowAction = async (workflowId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_WORKFLOW_EXECUTION,
    ApiEndpoints.WORKFLOW,
    workflowId,
    ApiEndpoints.EXECUTE
  )

  try {
    await apiService<WorkflowEntity>({
      endpoint,
      method: 'POST'
    })

    showSuccessMessage({
      description: 'The workflow has been scheduled for execution. Check the execution logs for details'
    })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })
  }
}

export const generateWorkflowAction = async (
  workflowId: string,
  message: string,
  configurationId: string
): Promise<WorkflowChatMessage> => {
  return {
    text: chatResponse,
    time: Date.now() + 1,
    isUser: false,
  } as WorkflowChatMessage

  const endpoint = getUrl(
    BASE_URLS.BASE_URL_WORKFLOW_GENERATOR,
    ApiEndpoints.WORKFLOW,
    `generate?cid=${configurationId}`,
  )

  setIsGenerating(true)

  try {
    const data: any = await apiService({
      endpoint,
      method: 'POST',
      body: message
    })

    updateSelectedWorkflow({
      content: {
        workflow: data.workflow,
        subflows: data.subflows || []
      },
      instructions: data.instructions,
      variables: data.variables
    })

    setIsWorkflowSaved(false)

    return {
      text: 'Workflow has been generated successfully',
      time: Date.now(),
      isUser: false,
    } as WorkflowChatMessage
  } catch (_error) {
    const error = _error as Error

    return {
      text: error.message,
      time: Date.now(),
      isUser: false,
    } as WorkflowChatMessage
  } finally {
    setIsGenerating(false)
  }
}

export const deployWorkflowAction = async (
  projectId: string,
  workflowId: string,
  data: DeployOperation[]
) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId,
    ApiEndpoints.WORKFLOWS,
    workflowId,
    ApiEndpoints.DEPLOY
  )

  try {
    const result = await apiService({
      endpoint,
      method: 'POST',
      body: data
    })

    showSuccessMessage({
      description: 'The workflow has been deployed successfully. Check the deployments page for details.'
    })

    return result
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}
