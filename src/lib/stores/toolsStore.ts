import { writable, derived } from 'svelte/store'

import { addQueryParams, getUrl } from '$lib/utils/url'
import { BASE_URLS } from '$lib/constants/url'
import { ApiEndpoints } from '$lib/constants/api'
import { apiService } from '$lib/services/apiService'
import type { PagePagination, Paginated } from '$lib/types/global'
import { showErrorMessage, showSuccessMessage } from '$lib/stores/toastsStore'
import type { Tool, Configuration, CreateToolByUrl, CreateToolBySchema } from '$lib/types/tool'
import type { Action } from '$lib/types/action'

export interface ToolsStore {
  tools: Paginated<Tool[]>
  provisions: Paginated<Configuration[]>
}

export const toolsStore  = writable<ToolsStore>({
  tools: {
    items: [],
    totalCount: 0
  },
  provisions: {
    items: [],
    totalCount: 0
  },
})

// selectors
export const toolsDataSelector = derived(toolsStore, ($toolsStore) => $toolsStore.tools)
export const provisionsDataSelector = derived(toolsStore, ($toolsStore) => $toolsStore.provisions)

// reducers
export const setTools = (data: Paginated<Tool[]>) => {
  toolsStore.update((store) => {
    store.tools = data
    return store
  })
}

export const setProvisions = (data: Paginated<Configuration[]>) => {
  toolsStore.update((store) => {
    store.provisions = data
    return store
  })
}

export const updateProvision = (data: Configuration) => {
  toolsStore.update((store) => {
    const index = store.provisions.items.findIndex((config) => config.id === data.id)
    store.provisions.items[index] = data
    return store
  })
}

export const removeProvision = (configId: string) => {
  toolsStore.update((store) => {
    store.provisions.items = store.provisions.items.filter((config) => config.id !== configId)
    store.provisions.totalCount -= - 1
    return store
  })
}

// actions
export const getToolsAction = async (
  pagination?: PagePagination & {
    type?: string
  },
  withPagination = true
)=> {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_TOOLS_REGISTRY,
    ApiEndpoints.TOOLS
  )

  const { page = 0, size = 20, type } = pagination || {}
  const url = withPagination ? `${endpoint}?page=${page}&size=${size}&type=${type ?? ''}` : endpoint

  try {
    const data = await apiService<Paginated<Tool[]>>({ endpoint: url })
    setTools(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return {
      items: [],
      totalCount: 0
    }
  }
}

export const getToolActions = async (toolId: string)=> {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_TOOLS_REGISTRY,
    ApiEndpoints.TOOLS,
    toolId,
    ApiEndpoints.ACTIONS
  )

  try {
    return await apiService<Paginated<Action[]>>({ endpoint })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return {
      items: [],
      totalCount: 0
    }
  }
}

export const createToolByUrlAction = async (tool: CreateToolByUrl) => {
  const endpoint =
    addQueryParams(
      getUrl(
        BASE_URLS.BASE_URL_TOOLS_REGISTRY,
        ApiEndpoints.TOOLS,
        ApiEndpoints.IMPORT_URL
      ),
      {
        isGlobal: false,
        name: tool.name,
        link: tool.link,
        credentials: tool.credentials,
        url: tool.url
      }
    )

  try {
    const data = await apiService<Tool>({
      endpoint,
      method: 'POST',
    })

    showSuccessMessage({ description: 'Tool created successfully' })
    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const createToolBySchemaAction = async (tool: CreateToolBySchema) => {
  const endpoint =
    addQueryParams(
      getUrl(
        BASE_URLS.BASE_URL_TOOLS_REGISTRY,
        ApiEndpoints.TOOLS,
        ApiEndpoints.IMPORT_SCHEMA
      ),
      {
        isGlobal: false,
        name: tool.name,
        link: tool.link,
        credentials: tool.credentials
      }
    )

  try {
    const data = await apiService<Tool>({
      endpoint,
      method: 'POST',
      body: tool.schema,
      headers: {
        'Content-Type': 'plain/text'
      }
    })

    showSuccessMessage({ description: 'Tool created successfully' })
    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const createToolActionAdapter = async (values: Record<string, any>) => {
  if (values.schema) {
    return createToolBySchemaAction(values as CreateToolBySchema)
  }

  if (values.url) {
    return createToolByUrlAction(values as CreateToolByUrl)
  }
}

export const deleteToolAction = async (id: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_TOOLS_REGISTRY,
    ApiEndpoints.TOOLS,
    id
  )

  try {
    const data = await apiService({
      endpoint,
      method: 'DELETE'
    })

    showSuccessMessage({ description: 'Tool was deleted' })

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const getProvisionsAction = async (
  pagination?: PagePagination,
  withPagination = true
)=> {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
  )

  const { page = 0, size = 20 } = pagination || {}
  const url = withPagination ? `${endpoint}?page=${page}&size=${size}` : endpoint

  try {
    const data =  await apiService<Paginated<Configuration[]>>({ endpoint: url })
    setProvisions(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return {
      items: [],
      totalCount: 0
    }
  }
}

export const getProvisionsBySchemasAction = async (schemas: string[]) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
    ApiEndpoints.BY_SCHEMAS,
  )
  try {
    return await apiService<{
      schema: string
      values: Configuration[]
    }[]>({ endpoint, method: 'POST', body: schemas })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const getProvisionsByTypeAction = async (type: 'TOOL' | 'LLM') => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
    ApiEndpoints.BY_TYPE,
  )
  try {
    return await apiService<Paginated<Configuration[]>>({ endpoint: `${endpoint}?type=${type}&size=100` })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const getProvisionByIdAction = async (configurationId: string)=> {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
    configurationId
  )
  try {
    return await apiService<Configuration>({ endpoint })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const createProvisionAction = async (config: Configuration) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS
  )

  try {
    const data = await apiService<Configuration>({
      endpoint,
      method: 'POST',
      body: config
    })

    showSuccessMessage({ description: 'Provision created successfully' })

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const updateProvisionAction = async (configId: string, config: Configuration) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
    configId
  )

  try {
    const data = await apiService<Configuration>({
      endpoint,
      method: 'PUT',
      body: config
    })
    updateProvision(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const deleteProvisionAction = async (configId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_CONFIGURATION,
    ApiEndpoints.CONFIGURATIONS,
    configId
  )

  try {
    const data = await apiService({
      endpoint,
      method: 'DELETE'
    })

    showSuccessMessage({ description: 'Tool was deleted' })
    removeProvision(configId)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}
