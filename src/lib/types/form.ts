export type FieldType =
  | 'text'
  | 'string'
  | 'password'
  | 'secret'
  | 'textarea'
  | 'file_upload'
  | 'number'
  | 'integer'
  | 'slider'
  | 'dropdown'
  | 'switch'
  | 'radio'

export interface FormFieldProps {
  label?: string
  name?: string
  required?: boolean
  tooltip?: string
  type: FieldType
  value?: string | number | boolean | File | null
  options?: string[]
  min?: number
  max?: number
  disabled?: boolean
}

export interface FormFieldChange {
  name: string
  value: string | number | boolean | File | null
}
