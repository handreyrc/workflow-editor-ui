import { ToolType } from '$lib/types/tool'

export const getValueByFormat = (format: string, name = '') => {
  if (format === ToolType.CLIENT_KEY_CLIENT_SECRET) {
    return {
      clientId: '',
      clientPassword: ''
    }
  }

  if (format === ToolType.OPENAI_CREDENTIALS) {
    return {
      baseUrl: getBaseUrl(name),
      apiKey: ''
    }
  }

  if (format === ToolType.BASIC_AUTH) {
    return {
      username: '',
      password: ''
    }
  }

  return ''
}

export const getBaseUrl = (name = '') => {
  switch (name.toLowerCase()) {
    case 'openai': return 'https://api.openai.com/v1'
    case 'deepseek': return 'https://api.deepseek.com'
    default: return ''
  }
}
