import { describe, it, expect } from 'vitest'

import { MarkdownParser } from './MarkdownParser'

describe('MarkdownParser', () => {
  const processMarkdown = async (markdown: string) => {
    const parser = new MarkdownParser()
    return parser.format({
      data: markdown
    })
  }

  it('should transform a simple js code block', async () => {
    const markdown = '```js\nconst x = 1;\n```'
    const result = await processMarkdown(markdown)

    expect(result).toContain('<CustomCode')
    expect(result).toContain('lang="js"')
    expect(result).toContain(`value="${encodeURIComponent('const x = 1;')}"`)
    expect(result).toContain('label=""')
  })

  it('should transform a simple json code block', async () => {
    const markdown = '```json\n{ "a": 1 }\n```'
    const result = await processMarkdown(markdown)

    expect(result).toContain('<CustomCode')
    expect(result).toContain('lang="json"')
    expect(result).toContain(`value="${encodeURIComponent('{ "a": 1 }')}"`)
  })

  it('should transform a md format with code block', async () => {
    const markdown = '#title\n```json\n{ "a": 1 }\n```'
    const result = await processMarkdown(markdown)

    expect(result).toContain('<h1>title</h1>')
    expect(result).toContain('<CustomCode')
    expect(result).toContain('lang="json"')
    expect(result).toContain(`value="${encodeURIComponent('{ "a": 1 }')}"`)
  })

  it('should handle empty input', async () => {
    const markdown = ''
    const result = await processMarkdown(markdown)

    expect(result).toBe('')
  })

  it('should transform markdown with different tags', async () => {
    const markdown = '# Title\n\n## Subtitle\n\n- List item 1\n- List item 2\n\n```js\nconsole.log("Hello, World!");\n```'
    const result = await processMarkdown(markdown)

    expect(result).toContain('<h1>Title</h1>')
    expect(result).toContain('<h2>Subtitle</h2>')
    expect(result).toContain('<ul><li>List item 1</li><li>List item 2</li></ul>')
    expect(result).toContain('<CustomCode')
    expect(result).toContain('lang="js"')
    expect(result).toContain(`value="${encodeURIComponent('console.log("Hello, World!");')}"`)
  })
})
