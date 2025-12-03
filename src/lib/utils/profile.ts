import type { UserProfile } from '$lib/types/user'
import type { Nullable } from '$lib/types/global'

export const getProfileInitials = (user: Nullable<UserProfile>) => {
  if (!user) return ''

  const firstInitial = user.firstName?.charAt(0) || ''
  const lastInitial = user.lastName?.charAt(0) || ''

  return (firstInitial + lastInitial).toUpperCase()
}
