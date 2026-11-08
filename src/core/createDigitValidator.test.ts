import { describe, it, expect } from 'vitest'
import { createDigitValidator } from './createDigitValidator.js'

describe('createDigitValidator', () => {
    it('accepts only 0 and 1 for base 2', () => {
        const isDigit = createDigitValidator(2)
        expect(isDigit('0')).toBe(true)
        expect(isDigit('1')).toBe(true)
        expect(isDigit('2')).toBe(false)
    })

    it('accepts digits 0-7 for base 8', () => {
        const isDigit = createDigitValidator(8)
        expect(isDigit('0')).toBe(true)
        expect(isDigit('1')).toBe(true)
        expect(isDigit('2')).toBe(true)
        expect(isDigit('3')).toBe(true)
        expect(isDigit('4')).toBe(true)
        expect(isDigit('5')).toBe(true)
        expect(isDigit('6')).toBe(true)
        expect(isDigit('7')).toBe(true)
        expect(isDigit('8')).toBe(false)
    })

    it('accepts digits 0-9 and rejects letters for base 10', () => {
        const isDigit = createDigitValidator(10)
        expect(isDigit('0')).toBe(true)
        expect(isDigit('1')).toBe(true)
        expect(isDigit('2')).toBe(true)
        expect(isDigit('3')).toBe(true)
        expect(isDigit('4')).toBe(true)
        expect(isDigit('5')).toBe(true)
        expect(isDigit('6')).toBe(true)
        expect(isDigit('7')).toBe(true)
        expect(isDigit('8')).toBe(true)
        expect(isDigit('9')).toBe(true)
        expect(isDigit('a')).toBe(false)
    })

    it('accepts hex letters in both cases for base 16', () => {
        const isDigit = createDigitValidator(16)
        expect(isDigit('0')).toBe(true)
        expect(isDigit('9')).toBe(true)
        expect(isDigit('a')).toBe(true)
        expect(isDigit('A')).toBe(true)
        expect(isDigit('f')).toBe(true)
        expect(isDigit('F')).toBe(true)
    })

    it('rejects characters beyond the alphabet for base 16', () => {
        const isDigit = createDigitValidator(16)
        expect(isDigit('g')).toBe(false)
        expect(isDigit('G')).toBe(false)
    })

    it('rejects empty and multi-character strings', () => {
        const isDigit = createDigitValidator(10)
        expect(isDigit('')).toBe(false)
        expect(isDigit('12')).toBe(false)
    })

    it('rejects symbols and whitespace', () => {
        const isDigit = createDigitValidator(16)
        expect(isDigit(' ')).toBe(false)
        expect(isDigit('-')).toBe(false)
    })
})
