import { visit } from 'unist-util-visit'

export const remarkCode = (options?: Record<string, any>): (tree: Node) => void => (tree: any) => {
  // Find code node in syntax tree
  visit(tree, 'code', (codeNode) => {
    const { value, meta, lang } = codeNode
    const content = encodeURIComponent(value)

    codeNode.type = 'html'
    codeNode.value = `<CustomCode label="${meta || ''}" lang="${lang}" value="${content}"></CustomCode>`
  })
}
