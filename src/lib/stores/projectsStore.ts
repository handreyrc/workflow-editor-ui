import { derived, writable } from 'svelte/store'

import { getUrl } from '$lib/utils/url'
import { BASE_URLS } from '$lib/constants/url'
import { ApiEndpoints } from '$lib/constants/api'
import { apiService } from '$lib/services/apiService'
import type { Nullable, PagePagination, Paginated } from '$lib/types/global'
import { showErrorMessage, showSuccessMessage } from '$lib/stores/toastsStore'
import type { Project } from '$lib/types/project'

export interface ProjectsStore {
  data: Paginated<Project[]>
  selectedProject: Nullable<Project>
}

export const projectsStore  = writable<ProjectsStore>({
  data: {
    items: [],
    totalCount: 0,
  },
  selectedProject: null,
})

// selectors
export const projectsDataSelector = derived(projectsStore, ($projectsStore) => $projectsStore.data)
export const selectedProjectSelector = derived(projectsStore, ($projectsStore) => $projectsStore.selectedProject)

// reducers
export const setProjects = (data: Paginated<Project[]>) => {
  projectsStore.update((store) => {
    store.data = data
    return store
  })
}

export const setSelectedProject = (project: Nullable<Project>) => {
  projectsStore.update((store) => {
    store.selectedProject = project
    return store
  })
}

// actions
export const getProjectsAction = async (pagination?: PagePagination)=> {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS
  )

  const { page = 0, size = 20 } = pagination || {}

  try {
    console.log("handrey --> getting projects...");
    
    //const data = await apiService<Paginated<Project[]>>({ endpoint: `${endpoint}?page=${page}&size=${size}` })
    //handrey 
    const projects =  await apiService<Project[]>({ endpoint })
    
    const data: Paginated<Project[]> = {
      "totalCount": projects.length,
      items: projects
    }

    setProjects(data) 
    return data

    // setProjects(dataMock) 
    // return dataMock
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return []
  }
}

export const createProjectAction = async (project: Project) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS
  )

  try {
    const data = await apiService<Project>({
      endpoint,
      method: 'POST',
      body: project
    })

    showSuccessMessage({ description: 'Project created successfully' })

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const getProjectAction = async (projectId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId
  )

  try {
    const data = await apiService<Project>({ endpoint })
    setSelectedProject(data)

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const updateProjectAction = async (
  projectId: string,
  project: Project,
) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId
  )

  try {
    const data =  await apiService<Project>({
      endpoint,
      method: 'PUT',
      body: project
    })

    showSuccessMessage({ description: 'The project has been successfully saved' })

    return data
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}

export const deleteProjectAction = async (projectId: string) => {
  const endpoint = getUrl(
    BASE_URLS.BASE_URL_PROJECT,
    ApiEndpoints.PROJECTS,
    projectId
  )

  try {
    return await apiService<Project>({ endpoint, method: 'DELETE' })
  } catch (_error) {
    const error = _error as Error
    showErrorMessage({ description: error.message })

    return null
  }
}
