export const removeEmptyFields = <T> (data: T): T | undefined => {
  if (data === false) return data
  if (!data) return undefined

  if (Array.isArray(data)) {
    if (data.length === 0) return undefined
    return data.map((item) => removeEmptyFields(item)) as unknown as T
  }

  if (typeof data === 'object') {
    if (Object.keys(data).length === 0) return undefined

    const cleanedData: Record<string, any> = {}
    for (const key in data) {
      const value = removeEmptyFields(data[key])

      if (value) {
        cleanedData[key] = value
      }
    }

    if (Object.keys(cleanedData).length === 0) return undefined

    return cleanedData as T
  }

  return data
}
