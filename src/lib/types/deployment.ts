import type { Nullable } from '$lib/types/global'

export enum DeploymentStatus {
  READY = 'READY', // may be not needed
  BUILD_SUCCESS = 'BUILD_SUCCESS',
  BUILD_FAILED = 'BUILD_FAILED',
  DEPLOY_IN_PROGRESS = 'DEPLOY_IN_PROGRESS',
  DEPLOY_SUCCESS = 'DEPLOY_SUCCESS',
  DEPLOY_FAILED = 'DEPLOY_FAILED',
}

export enum ExecutionStatus {
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Deployment {
  deploymentId: string
  projectId: string
  workflowId: string
  workflowName: string
  workflowVersion: string
  url: Nullable<string>
  status: DeploymentStatus
  projectName: string
  executionPath: string
}
