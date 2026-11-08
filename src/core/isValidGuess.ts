import type { BaseValue, Guess } from './types.js'

export const isValidGuess = (
    guess: Guess,
    length: number,
    base: BaseValue
): boolean => {
    throw new Error(
        `isValidGuess is not implemented (guess: ${guess}, length: ${length}, base: ${base})`
    )
}
