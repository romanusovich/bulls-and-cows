import type { Guess, GuessResult, Secret } from './types.js'

export const evaluateGuess = (secret: Secret, guess: Guess): GuessResult => {
    throw new Error(
        `evaluateGuess is not implemented (secret: ${secret}, guess: ${guess})`
    )
}
