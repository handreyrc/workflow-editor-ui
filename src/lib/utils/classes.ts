export const getTagClasses = (tag: string) => {
  switch (tag) {
  case 'Automation':
    return 'bg-custom-green text-green-500'
  case 'Social Media':
    return 'bg-custom-blue text-blue-500'
  case 'File Sharing':
    return 'bg-custom-yellow text-yellow-500'
  case '15 More':
    return 'bg-custom-gray text-white'
  case 'Training':
    return 'bg-custom-orange text-orange-500'
  case 'HR':
    return 'bg-custom-purple text-purple-500'
  case 'Marketing':
    return 'bg-custom-pink text-pink-500'
  default:
    return 'bg-gray-200 text-gray-500'
  }
}
