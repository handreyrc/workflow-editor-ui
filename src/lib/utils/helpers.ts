/*
  helper function to set a value in an object by a path
*/
export const set = <T extends object>(obj: T, path: string | Array<string | number>, value: any): T => {
  if (!obj || typeof obj !== 'object') return obj

  // Convert string path to array
  const keys = typeof path === 'string'
    ? path.replace(/\[(\d+)\]/g, '.$1').split('.')
    : path

  let current: any = obj
  keys.slice(0, -1).forEach((key, i) => {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = isNaN(Number(keys[i + 1])) ? {} : []
    }
    current = current[key]
  })

  current[keys[keys.length - 1] as string | number] = value
  return obj
}


export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): T => {
  let lastFunc: number
  let lastRan: number

  return ((...args: any[]) => {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = window.setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }) as T
}

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timer: number

  return ((...args: any[]) => {
    const context = this
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }) as T
}
