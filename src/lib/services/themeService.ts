import { writable } from 'svelte/store'

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const getInitialTheme = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('theme') as Theme || Theme.Light
  }

  return Theme.Light
}

export const theme = writable<Theme>(getInitialTheme())

theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('white-mode', value === 'light')
    localStorage?.setItem('theme', value)
  }
})
