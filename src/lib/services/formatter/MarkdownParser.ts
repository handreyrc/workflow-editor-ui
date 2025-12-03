import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import { remarkCode } from '$lib/utils/parser'

export class MarkdownParser {
  async format (input: Record<string, any>) {
    const { data } = input

    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkGfm) // support GitHub Flavored Markdown
        .use(remarkCode)
        .use(remarkRehype, { allowDangerousHtml: true }) // Pass raw HTML strings through.
        .use(rehypeStringify, { allowDangerousHtml: true }) // Serialize the raw HTML strings
        .process(data)

      return String(file)
    } catch (error) {
      console.error('Markdown to HTML conversion error:', error)
      throw error
    }
  }
}
