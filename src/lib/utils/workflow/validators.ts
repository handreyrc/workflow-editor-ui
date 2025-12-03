export const isValidJSONArray = (value?: string): boolean => {
  if (!value) return false

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
  } catch (e) {
    return false
  }
}

export const isValidJSONObject = (value?: string): boolean => {
  if (!value) return false

  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null
  } catch (e) {
    return false
  }
}

export const isValidISO8601Date = (value?: string): boolean => {
  return (/^P(?!$)(\d+(?:\.\d+)?Y)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?W)?(\d+(?:\.\d+)?D)?(T(?=\d)(\d+(?:\.\d+)?H)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?S)?)?$/)
    .test(value || '')
}
