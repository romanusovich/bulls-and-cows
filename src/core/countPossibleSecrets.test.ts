import { describe, it, expect } from 'vitest'
import { countPossibleSecrets } from './countPossibleSecrets.js'

describe('countPossibleSecrets', () => {
    describe('known values', () => {
        const cases: Array<[number, number, number]> = [
            // [length, base, expected]
            [2, 2, 2],
            [1, 2, 2],
            [2, 8, 56],
            [3, 8, 336],
            [1, 10, 10],
            [2, 10, 90],
            [4, 10, 5040],
            [6, 10, 151200],
            [2, 16, 240],
            [6, 16, 5765760],
        ]

        it.each(cases)(
            'length %i in base %i gives %i',
            (length, base, expected) => {
                expect(countPossibleSecrets(length, base)).toBe(expected)
            }
        )
    })

    describe('edge cases', () => {
        it('returns 1 for length 0 (the recursion base case)', () => {
            expect(countPossibleSecrets(0, 10)).toBe(1)
        })

        it('equals the factorial when length equals base', () => {
            expect(countPossibleSecrets(6, 6)).toBe(720)
        })

        it('returns 0 when length exceeds base', () => {
            expect(countPossibleSecrets(3, 2)).toBe(0)
            expect(countPossibleSecrets(7, 6)).toBe(0)
        })
    })

    describe('recurrence', () => {
        const cases: Array<[number, number]> = [
            [2, 10],
            [4, 10],
            [3, 8],
            [6, 16],
        ]

        it.each(cases)(
            'P(%i, %i) equals base * P(length - 1, base - 1)',
            (length, base) => {
                expect(countPossibleSecrets(length, base)).toBe(
                    base * countPossibleSecrets(length - 1, base - 1)
                )
            }
        )
    })

    describe('repeated calls', () => {
        it('returns the same result for the same arguments', () => {
            expect(countPossibleSecrets(4, 10)).toBe(
                countPossibleSecrets(4, 10)
            )
        })
    })
})
