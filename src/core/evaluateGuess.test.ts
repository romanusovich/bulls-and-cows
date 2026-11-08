import { describe, it, expect } from 'vitest'
import { evaluateGuess } from './evaluateGuess.js'

describe('evaluateGuess', () => {
    describe('decimal', () => {
        it('returns all bulls for an exact match', () => {
            expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 })
        })

        it('returns zeros when there are no common digits', () => {
            expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 })
        })

        it('returns all cows when every digit is misplaced', () => {
            expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 })
        })

        it('counts bulls and cows together', () => {
            expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 })
        })

        it('counts a single bull with no cows', () => {
            expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 })
        })

        it('counts cows without bulls for a partially shifted guess', () => {
            expect(evaluateGuess('1234', '5123')).toEqual({ bulls: 0, cows: 3 })
        })

        it('does not count a bull as a cow', () => {
            expect(evaluateGuess('1234', '1325')).toEqual({ bulls: 1, cows: 2 })
        })

        it('handles a leading zero', () => {
            expect(evaluateGuess('0123', '0132')).toEqual({ bulls: 2, cows: 2 })
        })
    })

    describe('binary', () => {
        it('detects an exact match', () => {
            expect(evaluateGuess('01', '01')).toEqual({ bulls: 2, cows: 0 })
        })

        it('detects a swapped pair', () => {
            expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 })
        })
    })

    describe('hexadecimal', () => {
        it('treats uppercase and lowercase as the same digit', () => {
            expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 })
            expect(evaluateGuess('A1B2', 'b2a1')).toEqual({ bulls: 0, cows: 4 })
        })

        it('counts mixed results with mixed case', () => {
            expect(evaluateGuess('a1b2', 'A2Bf')).toEqual({ bulls: 2, cows: 1 })
        })

        it('works with the maximum length of 6', () => {
            expect(evaluateGuess('abcdef', 'abcdef')).toEqual({
                bulls: 6,
                cows: 0,
            })
        })
    })

    describe('properties', () => {
        const pairs: ReadonlyArray<readonly [string, string]> = [
            ['1234', '1243'],
            ['1234', '4321'],
            ['0123', '3210'],
            ['a1b2', 'f2b1'],
        ]

        it.each(pairs)('is symmetric for %s and %s', (a, b) => {
            expect(evaluateGuess(a, b)).toEqual(evaluateGuess(b, a))
        })

        it.each(pairs)(
            'never reports more bulls and cows than digits for %s and %s',
            (a, b) => {
                const { bulls, cows } = evaluateGuess(a, b)
                expect(bulls + cows).toBeLessThanOrEqual(a.length)
            }
        )

        it('returns the same result for the same input', () => {
            expect(evaluateGuess('1234', '1325')).toEqual(
                evaluateGuess('1234', '1325')
            )
        })
    })
})
