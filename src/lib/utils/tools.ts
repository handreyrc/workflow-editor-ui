export const getToolByOperation = (operation: string) => {
  const match = operation.match(/^(?:specs\/)?([^./]+)/)
  return match ? match[1] : ''
}

export const getSpecByOperation = (operation: string) => {
  const match = operation.match(/(?:\/|^)([^/#]+?)(?:\.(yml|yaml|json))?((?:#.*))?$/)

  if (!match) return {
    schema: '',
    filename: '',
    extension: '',
    operation: ''
  }

  const filename = match[1]
  const extension = match[2]

  return {
    schema: extension ? `${filename}.${extension}` : filename,
    filename,
    extension,
    operation: match[3]
  }
}
