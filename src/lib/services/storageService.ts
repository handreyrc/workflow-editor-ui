import type { Nullable } from '$lib/types/global'

class StorageService {
  private readonly storage: Nullable<Storage>

  constructor(storage: Nullable<Storage>) {
    this.storage = storage
  }

  get(itemName: string = '') {
    let data
    try {
      data = this.storage?.getItem(itemName)
    } catch (error) {
      console.error(`getItem from storage error: ${error}`)
    }

    if (data) {
      try {
        return JSON.parse(data)
      } catch (e) {
        return data
      }
    }
    return null
  }

  getAll() {
    return this.storage
  }

  set(key: string = '', data: any) {
    try {
      if (typeof data === 'object' && data !== null) {
        this.storage?.setItem(key, JSON.stringify(data))
      } else {
        this.storage?.setItem(key, data)
      }
    } catch (error) {
      console.error(`setItem to storage error: ${error}`)
    }
  }

  remove(itemName: string = '') {
    this.storage?.removeItem(itemName)
  }
}

export const getLocalStorage = () => typeof localStorage !== 'undefined' ? localStorage : null
export const getSessionStorage = () => typeof sessionStorage !== 'undefined' ? sessionStorage : null

export const localStorageService = new StorageService(getLocalStorage())
export const sessionStorageService = new StorageService(getSessionStorage())
