import { test, expect, describe } from 'vitest'

import { isValidISO8601Date } from './validators'

describe('isValidISO8601Date', () => {
  const testCases = [
    { input: 'P1Y2M3DT4H5M6S', expected: true },
    { input: 'P1Y2M3W4D', expected: true },
    { input: 'P1Y2M3D', expected: true },
    { input: 'PT4H5M6S', expected: true },
    { input: 'P1Y', expected: true },
    { input: 'P1M', expected: true },
    { input: 'P1W', expected: true },
    { input: 'P1D', expected: true },
    { input: 'PT1H', expected: true },
    { input: 'PT1M', expected: true },
    { input: 'PT1S', expected: true },
    { input: 'PTX6', expected: false },
    { input: '', expected: false },
    { input: undefined, expected: false },
  ]

  test.each(testCases)('should return $expected for input $input', ({ input, expected }) => {
    expect(isValidISO8601Date(input)).toBe(expected)
  })
})
