export const getUrl = (...path: string[]) => `${path.join('/')}`

export const addQueryParams = (
  url: string,
  params: Record<string, string | number | boolean | undefined>
) => {

  const urlObj = new URL(url)
  Object.entries(params)
    .forEach(([key, value]) => {
      const stringifiedValue = value === undefined ? '' : String(value)

      urlObj.searchParams.append(key, stringifiedValue)
    })
  return urlObj.toString()
}
