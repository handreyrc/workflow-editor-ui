import { writable, derived } from 'svelte/store'

import { LocalStorageKey } from '$lib/types/storage'
import { localStorageService } from '$lib/services/storageService'

export interface AppStore {
  workflow: {
    direction: string
    isSidebarMinimized: boolean
    isMiniMapVisible: boolean
    sidebarTab?: string
    [key: string]: any
  }
}

export const appStore  = writable<AppStore>({
  workflow: localStorageService.get(LocalStorageKey.WorkflowSettings) ?? {},
})

// selectors

export const workflowSettingsSelector = derived(appStore, ($appStore) => $appStore.workflow)

// reducers

export const setWorkflowSettings = (key: string, value: any) => {
  appStore.update((store) => {
    store.workflow[key] = value
    localStorageService.set(LocalStorageKey.WorkflowSettings, store.workflow)

    return store
  })
}
