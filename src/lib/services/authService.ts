import type { KeycloakConfig, KeycloakError, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'

import { clearAuthState, setAuth, updateAuthToken } from '$lib/stores/authStore'

let keycloakInstance: Keycloak

export const getKeycloak = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    } as unknown as KeycloakConfig)
  }
  return keycloakInstance
}

export const initKeycloakAuth = async () => {
  const keycloak = getKeycloak()

  // set up event listeners - BEFORE init
  keycloak.onTokenExpired = () => refreshToken()
  keycloak.onAuthRefreshSuccess = () => onAuthRefreshSuccess()
  keycloak.onAuthError = handleAuthError
  keycloak.onAuthRefreshError = () => handleAuthError({} as KeycloakError)

  await keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
  } as unknown as KeycloakInitOptions)

  return {
    isAuthenticated: keycloak.authenticated,
    token: keycloak.token,
    profile: await keycloak.loadUserProfile()
  }
}

export const initAuthorization = async () => {
  try {
    const data = await initKeycloakAuth()

    if (data.isAuthenticated) {
      setAuth(data)
    } else {
      clearAuthState()
      await getKeycloak().login()
    }

  } catch (e) {
    console.error(e)
    clearAuthState()
    await getKeycloak().login()
  }
}

export const getAuthToken = () => getKeycloak().token
export const isTokenExpired = () => getKeycloak().isTokenExpired()

export const refreshToken = async () => {
  const keycloak = getKeycloak()
  await keycloak.updateToken()
}

export const onAuthRefreshSuccess = async () => {
  // after token was refreshed, need to save new token
  const keycloak = getKeycloak()
  updateAuthToken(keycloak.token)
}

export const handleAuthError = (error: KeycloakError) => {
  console.error(error)
  clearAuthState()
  getKeycloak().login()
}

export async function login() {
  return getKeycloak().login()
}

export async function logout() {
  clearAuthState()
  return getKeycloak().logout()
}

