import type { Nullable } from '$lib/types/global'

export interface Project {
  name: string
  createdAt: string
  deleted: boolean
  description: string
  id: string
  organizationId: string
  owner: string
  updatedAt: Nullable<string>
  version: number
}
