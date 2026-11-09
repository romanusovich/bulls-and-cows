import { describe, it, expect } from 'vitest'
import { reduceLength, getAvailableLengths } from './availableLengths.js'
import type { BaseValue } from './types.js'

describe('getAvailableLengths', () => {
    const cases: Array<[BaseValue, number[]]> = [
        [2, [2]],
        [8, [2, 3, 4, 5, 6]],
        [10, [2, 3, 4, 5, 6]],
        [16, [2, 3, 4, 5, 6]],
    ]

    it.each(cases)('for base %i returns %j', (base, expected) => {
        expect(getAvailableLengths(base)).toEqual(expected)
    })

    it('allows only length 2 for the binary system', () => {
        expect(getAvailableLengths(2)).toEqual([2])
    })

    it.each<BaseValue>([2, 8, 10, 16])(
        'never offers a length above the base %i',
        (base) => {
            expect(Math.max(...getAvailableLengths(base))).toBeLessThanOrEqual(
                base
            )
        }
    )

    it('returns the same result for repeated calls', () => {
        expect(getAvailableLengths(10)).toEqual(getAvailableLengths(10))
    })
})

describe('clampLength', () => {
    const cases: Array<[number, BaseValue, number]> = [
        [4, 10, 4],
        [2, 10, 2],
        [6, 8, 6],
        [5, 2, 2],
        [3, 2, 2],
        [7, 16, 6],
        [1, 10, 2],
    ]

    it.each(cases)(
        'length %i in base %i becomes %i',
        (length, base, expected) => {
            expect(reduceLength(length, base)).toBe(expected)
        }
    )

    it('always returns a length that is available for the base', () => {
        const bases: BaseValue[] = [2, 8, 10, 16]

        for (const base of bases) {
            for (const length of [0, 1, 2, 3, 6, 7, 100]) {
                expect(getAvailableLengths(base)).toContain(
                    reduceLength(length, base)
                )
            }
        }
    })
})
