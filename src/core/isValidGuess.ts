import { createDigitValidator } from './createDigitValidator.js'
import type { BaseValue, Guess } from './types.js'

export const isValidGuess = (
    guess: Guess,
    length: number,
    base: BaseValue
): boolean => {
    const isValidDigit = createDigitValidator(base)
    const chars = [...guess]
    const uniqueChars = new Set(chars.map((char) => char.toLowerCase()))

    return (
        chars.length === length &&
        chars.every(isValidDigit) &&
        uniqueChars.size === chars.length
    )
}
