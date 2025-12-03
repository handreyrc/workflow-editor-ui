import type { Component } from 'svelte'

export interface DropDownOption {
  id: string
  label: string
  value: string
  disabled?: boolean
  component?: Component<any>
  [key: string]: any
}
