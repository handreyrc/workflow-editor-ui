import { vi, afterEach } from 'vitest'

vi.mock('$app/navigation', () => {
  return {
    goto: vi.fn(),
  }
})

afterEach(() => {
  vi.clearAllMocks()
})
