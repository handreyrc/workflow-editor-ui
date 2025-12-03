export const truncateText = (text: string, characterLimit: number, end = '') => {
  const words = text
  return words?.length > characterLimit ? words.slice(0, characterLimit) + end : text
}
