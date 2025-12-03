import type { Component } from 'svelte'

export type Column<T> = {
  key: keyof T
  label: string
  isSorting?: boolean
  className?: string
  render?: (value: T[keyof T], row: T) => string
  component?: Component<{
    row: T
  }>
}
