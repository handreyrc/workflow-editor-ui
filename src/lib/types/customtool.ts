import type { Nullable } from '$lib/types/global'

export interface CustomTool {
  createdAt: string,
  deleted: boolean,
  description: string,
  id: string,
  format: string,
  meta: string,
  name: string,
  schema: string,
  type: string,
  updatedAt: Nullable<string>,
  version: number

}
