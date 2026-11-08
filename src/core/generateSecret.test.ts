import { describe, it, expect, vi } from 'vitest'
import { generateSecret } from './generateSecret.js'
import { ALPHABET, type BaseValue } from './types.js'

const fromSequence = (...values: number[]) => {
    let call = 0
    return () => values[call++ % values.length] ?? 0
}

describe('generateSecret with deterministic random', () => {
    it('picks the first available digit each time when random returns 0', () => {
        expect(generateSecret(4, 10, () => 0)).toBe('0123')
    })

    it('picks the last available digit each time when random is close to 1', () => {
        expect(generateSecret(4, 10, () => 0.999)).toBe('9876')
    })

    it('follows the given sequence of random values', () => {
        expect(generateSecret(4, 10, fromSequence(0.5, 0, 0.9, 0.3))).toBe(
            '5093'
        )
    })

    it('allows a leading zero', () => {
        expect(generateSecret(3, 10, () => 0).startsWith('0')).toBe(true)
    })

    it('produces lowercase letters for base 16', () => {
        expect(generateSecret(6, 16, () => 0.999)).toBe('fedcba')
    })

    it('works for the smallest case: base 2, length 2', () => {
        expect(generateSecret(2, 2, () => 0)).toBe('01')
        expect(generateSecret(2, 2, () => 0.999)).toBe('10')
    })

    it('calls random exactly once per digit', () => {
        const random = vi.fn(() => 0)
        generateSecret(4, 10, random)
        expect(random).toHaveBeenCalledTimes(4)
    })

    it('returns the same result for the same random source', () => {
        const first = generateSecret(4, 16, fromSequence(0.1, 0.7, 0.4, 0.9))
        const second = generateSecret(4, 16, fromSequence(0.1, 0.7, 0.4, 0.9))
        expect(first).toBe(second)
    })
})

describe('generateSecret invariants with the default random', () => {
    const bases: BaseValue[] = [2, 8, 10, 16]

    it.each(bases)('always returns a valid secret for base %i', (base) => {
        const alphabet = ALPHABET.slice(0, base)
        const maxLength = Math.min(6, base)

        for (let length = 2; length <= maxLength; length++) {
            for (let attempt = 0; attempt < 50; attempt++) {
                const chars = [...generateSecret(length, base)]

                expect(chars).toHaveLength(length)
                expect(new Set(chars).size).toBe(length)
                expect(chars.every((char) => alphabet.includes(char))).toBe(
                    true
                )
            }
        }
    })
})

describe('generateSecret with impossible parameters', () => {
    it('throws a RangeError when length exceeds the number of digits', () => {
        expect(() => generateSecret(3, 2)).toThrow(RangeError)
    })
})
