import { derived, writable } from 'svelte/store'

import type { Nullable, PagePagination, Paginated } from '$lib/types'
import type { Deployment } from '$lib/types/deployment'
import { BASE_URLS } from '$lib/constants/url'
import { ApiEndpoints } from '$lib/constants/api'
import { apiService } from '$lib/services/apiService'
import { showErrorMessage } from '$lib/stores/toastsStore'
import { graphqlService } from '$lib/services/graphqlService'

import { getUrl } from '../utils/url'

export interface DeploymentsStore {
  data: Paginated<Deployment[]>
  selectedDeployment: Nullable<Deployment>
}

export const deploymentsStore = writable<DeploymentsStore>({
  data: {
    items: [],
    totalCount: 0,
  },
  selectedDeployment: null,
})

// selectors
export const deploymentsDataSelector = derived(deploymentsStore, ($deploymentsStore) => $deploymentsStore.data)
export const selectedDeploymentSelector = derived(deploymentsStore, ($deploymentsStore) => $deploymentsStore.selectedDeployment)

// reducers
export const setDeployments = (data: Paginated<Deployment[]>) => {
  deploymentsStore.update((store) => {
    store.data = data
    return store
  })
}

export const setSelectedDeployment = (deployment: Nullable<Deployment>) => {
  deploymentsStore.update((store) => {
    store.selectedDeployment = deployment
    return store
  })
}

// actions
export const getDeploymentsAction = async (projectId: string, pagination?: PagePagination) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId,
    ApiEndpoints.DEPLOYMENTS,
  )

  const { page = 0, size = 20 } = pagination || {}

  try {
    const data = await apiService<Paginated<Deployment[]>>({ endpoint: `${endpoint}?page=${page}&size=${size}` })
    setDeployments(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return []
  }
}

export const getDeploymentAction = async (projectId: string, deploymentId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId,
    ApiEndpoints.DEPLOYMENTS,
    deploymentId,
  )

  try {
    const data = await apiService<Deployment>({ endpoint })
    setSelectedDeployment(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}


export const executeDeploymentAction = async (
  url: string,
  executePath: string,
  data: Record<string, any>
) => {
  const endpoint = getUrl(
    url,
    executePath
  )

  try {
    return await apiService({ endpoint, method: 'POST', body: data })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const getDeploymentExecutionsActions =  async ({
  processId
}: {
  processId?: string
}) => {
  if (!processId) {
    return null
  }

  const ExecutionsQuery = `query ($processId: String!) {
    ProcessInstances(
      where: { processId: { equal: $processId } }
      orderBy: { lastUpdate: DESC }
      pagination: { limit: 10, offset: 0 }
    ) {
      id
      rootProcessId
      processId
      state
      lastUpdate
    }
  }`

  const { data } = await graphqlService.client.query(ExecutionsQuery, { processId })
  return data
}
