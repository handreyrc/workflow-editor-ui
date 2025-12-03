import { expect, test, vi, describe, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/svelte'
import { type Writable, writable } from 'svelte/store'

import type { Paginated } from '$lib/types'
import { type Tool, ToolType } from '$lib/types/tool'

import AvailablePage from './+page.svelte'

describe('Tool Available Page', () => {
  afterEach(() => {
    cleanup()
  })

  test('should render', async () => {
    expect(render(AvailablePage)).toBeTruthy()
  })

  test('should properly render tools', async () => {
    vi.mock('$lib/stores/toolsStore', async () => {
      const tools: Writable<Paginated<Tool[]>> = writable({
        totalCount: 1,
        items: [
          {
            id: '1',
            owner: '1',
            createdAt: '2025-03-08T11:09:11.385124Z',
            deleted: false,
            version: 0,
            name: 'OpenAI',
            description: 'Open AI LLM Provider',
            label: 'Open-AI',
            type: 'LLM',
            format: ToolType.OPENAI_CREDENTIALS,
            link: 'https://platform.openai',
            global: true,
          }
        ]
      })

      return {
        ...(await vi.importActual('$lib/stores/toolsStore')),
        toolsDataSelector: tools
      }
    })

    render(AvailablePage)

    await waitFor(() => {
      expect(screen.queryByTestId('global-loader')).toBeFalsy()
    })
    expect(screen.getByTestId('tool-OpenAI')).toBeTruthy()
  })
})

