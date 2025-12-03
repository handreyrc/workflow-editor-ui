import { derived, get, writable } from 'svelte/store'
import { createToaster } from '@skeletonlabs/skeleton-svelte'
import type { Options, Store } from '@zag-js/toast'

import type { Nullable } from '$lib/types'

export interface ToastStore {
  toaster: Nullable<Store>
}

export const toastsStore = writable<ToastStore>({
  toaster: null
})

// selectors
export const toasterSelector = derived(toastsStore, ($toastsStore) => $toastsStore.toaster)

export const initializeToaster = () => {
  toastsStore.update((store) => {
    store.toaster = createToaster({
      placement: 'bottom-end',
      max: 4
    })

    return store
  })
}


// TODO: Toasts in skeleton are still in progress, so we need to wait for the final implementation
export const showSuccessMessage = (options: Options) => {
  get(toasterSelector)
    ?.success({
      title: 'Success',
      ...options
    })
}

export const showErrorMessage = (options: Options) => {
  get(toasterSelector)
    ?.error({
      title: 'Error Occurred',
      ...options
    })
}

export const showWarningMessage = (options: Options) => {
  get(toasterSelector)
    ?.warning({
      title: 'Warning',
      ...options
    })
}
