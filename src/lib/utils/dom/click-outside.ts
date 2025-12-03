import type { Action } from 'svelte/action'

export const clickOutside: Action<HTMLElement, (event: MouseEvent) => void> = (node: Node, callback: (event: MouseEvent) => void) => {
  const handleClick = (event: MouseEvent) => {
    if (event.detail === 0) return // skip synthetic clicks (keyboard)
    if (!(event instanceof MouseEvent)) return

    if (!node.contains(event.target as HTMLElement)) {
      if (callback) callback(event)
    }
  }

  document.addEventListener('click', handleClick, true)

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    }
  }
}
