import { describe, it, expect } from 'vitest'
import { isValidGuess } from './isValidGuess.js'

describe('isValidGuess', () => {
    describe('valid guesses', () => {
        it('accepts a correct decimal guess', () => {
            expect(isValidGuess('1234', 4, 10)).toBe(true)
        })

        it('accepts a leading zero', () => {
            expect(isValidGuess('0123', 4, 10)).toBe(true)
        })

        it('accepts a correct binary guess', () => {
            expect(isValidGuess('01', 2, 2)).toBe(true)
        })

        it('accepts hex letters in both cases', () => {
            expect(isValidGuess('a1f3', 4, 16)).toBe(true)
            expect(isValidGuess('A1F3', 4, 16)).toBe(true)
            expect(isValidGuess('a1F3', 4, 16)).toBe(true)
        })
    })

    describe('invalid length', () => {
        it('rejects a guess that is too short', () => {
            expect(isValidGuess('123', 4, 10)).toBe(false)
        })

        it('rejects a guess that is too long', () => {
            expect(isValidGuess('12345', 4, 10)).toBe(false)
        })

        it('rejects an empty guess', () => {
            expect(isValidGuess('', 4, 10)).toBe(false)
        })
    })

    describe('invalid characters', () => {
        it('rejects a digit outside the binary alphabet', () => {
            expect(isValidGuess('02', 2, 2)).toBe(false)
        })

        it('rejects a digit outside the octal alphabet', () => {
            expect(isValidGuess('1238', 4, 8)).toBe(false)
        })

        it('rejects letters in a decimal guess', () => {
            expect(isValidGuess('12a4', 4, 10)).toBe(false)
        })

        it('rejects letters beyond f in a hex guess', () => {
            expect(isValidGuess('12g4', 4, 16)).toBe(false)
        })

        it('rejects spaces and symbols', () => {
            expect(isValidGuess('12 4', 4, 10)).toBe(false)
            expect(isValidGuess('12-4', 4, 10)).toBe(false)
        })
    })

    describe('repeated digits', () => {
        it('rejects a repeated digit', () => {
            expect(isValidGuess('1123', 4, 10)).toBe(false)
        })

        it('rejects a repeated digit that is not adjacent', () => {
            expect(isValidGuess('1231', 4, 10)).toBe(false)
        })

        it('rejects a repeat that differs only by case in hex', () => {
            expect(isValidGuess('aA12', 4, 16)).toBe(false)
        })

        it('rejects a binary guess with the same digit twice', () => {
            expect(isValidGuess('00', 2, 2)).toBe(false)
        })
    })
})
