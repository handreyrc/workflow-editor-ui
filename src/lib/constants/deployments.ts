import { DeploymentStatus } from '$lib/types/deployment'

export const DeploymentStatuses = {
  [DeploymentStatus.READY]: 'Ready',
  [DeploymentStatus.BUILD_SUCCESS]: 'Build Success',
  [DeploymentStatus.BUILD_FAILED]: 'Build Failed',
  [DeploymentStatus.DEPLOY_IN_PROGRESS]: 'Deploy In Progress',
  [DeploymentStatus.DEPLOY_SUCCESS]: 'Deployed',
  [DeploymentStatus.DEPLOY_FAILED]: 'Deploy Failed',
}
