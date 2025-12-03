import { get, type Writable, writable } from 'svelte/store'

import { set } from '../helpers'

export type UseFormOptions<T> = {
  initialValues: T
  validateOnInit?: boolean
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onChange?: (form: UseForm<T>) => void
}

export interface UseForm<T> {
  values: T
  errors: Partial<Record<keyof T | string, string>>
  touched: Partial<Record<keyof T | string, boolean>>
  status: {
    isChanged: boolean
    isSubmitting: boolean
    isError: boolean
    isSuccess: boolean
  }
  change: (key: Partial<keyof T> | string, value: any, isTouched?: boolean) => void
  blur: (key: Partial<keyof T> | string) => void
  validate: () => void
  reset: () => void
  resetTouched: () => void
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const { initialValues, validateOnInit, validate, onChange } = options

  const checkIsError = (errors: Partial<Record<keyof T, string>>) => Object.values(errors).filter(Boolean).length > 0

  const formStore: Writable<UseForm<T>> = writable({
    values: { ...initialValues },
    errors: {} as Partial<Record<keyof T | string, string>>,
    touched: {} as Partial<Record<keyof T | string, boolean>>,
    status: {
      isChanged: false,
      isSubmitting: false,
      isError: false,
      isSuccess: false
    },
    change: (key: Partial<keyof T> | string, value: any, isTouched = true) => {
      formStore.update((state) => {
        const errors =  { ...state.errors, [key]: undefined }
        return {
          ...state,
          touched: set(state.touched, key as string, isTouched),
          values: set(state.values, key as string, value),
          errors,
          status: {
            ...state.status,
            isError: checkIsError(errors),
            isChanged: true
          }
        }
      })

      onChange?.(get(formStore))
    },
    blur: (key: Partial<keyof T> | string) => {
      if (!validate) return
      formStore.update((state) => {
        const validationErrors = validate(state.values)
        return {
          ...state,
          touched: { ...state.touched, [key]: true },
          errors: { ...state.errors, [key]: validationErrors[key] },
          status: { ...state.status, isError: checkIsError(validationErrors) }
        }
      })
    },
    validate: () => {
      if (!validate) return
      formStore.update((state) => {
        const validationErrors = validate(state.values)
        return {
          ...state,
          errors: validationErrors,
          status: { ...state.status, isError: checkIsError(validationErrors) }
        }
      })
    },
    reset: () => {
      formStore.update((state) => ({
        ...state,
        values: { ...initialValues },
        errors: {} as Partial<Record<keyof T | string, string>>,
        status: { isSubmitting: false, isError: false, isSuccess: false, isChanged: false },
      }))
    },
    resetTouched: () => {
      formStore.update((state) => ({
        ...state,
        touched: {} as Partial<Record<keyof T | string, boolean>>,
        status: { ...state.status, isChanged: false }
      }))
    }
  })

  if (validateOnInit) {
    formStore.update((state) => {
      const validationErrors = validate?.(state.values) || {}
      return {
        ...state,
        errors: validationErrors,
        status: { ...state.status, isError: checkIsError(validationErrors) }
      }
    })
  }

  return formStore
}
