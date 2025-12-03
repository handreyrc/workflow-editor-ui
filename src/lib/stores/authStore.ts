import { writable, derived } from 'svelte/store'

import { LocalStorageKey } from '$lib/types/storage'
import { localStorageService } from '$lib/services/storageService'
import type { UserProfile } from '$lib/types/user'
import type { Nullable } from '$lib/types/global'

export interface AuthStore {
  token: Nullable<string>
  isAuthenticated: boolean
  profile: Nullable<UserProfile>
}

export const authStore  = writable<AuthStore>({
  token: localStorageService.get(LocalStorageKey.AuthToken),
  isAuthenticated: false,
  profile: null
})

// selectors
export const userProfile = derived(authStore, ($authStore) => $authStore.profile)

// reducers
export const clearAuthState = () => {
  authStore.update((store) => {
    store.isAuthenticated = false
    store.token = null
    store.profile

    localStorageService.remove(LocalStorageKey.AuthToken)

    return store
  })
}

export const setAuth = (data: AuthStore) => {
  authStore.set(data)
  localStorageService.set(LocalStorageKey.AuthToken, data.token)
}

export const updateAuthToken = (token: string) => {
  authStore.update((store) => {
    store.token = token
    localStorageService.set(LocalStorageKey.AuthToken, token)

    return store
  })
}
