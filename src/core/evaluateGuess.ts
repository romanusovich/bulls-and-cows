import type { Guess, GuessResult, Secret } from './types.js'

export const evaluateGuess = (secret: Secret, guess: Guess): GuessResult => {
    const secretChars = [...secret.toLowerCase()]
    const guessChars = [...guess.toLowerCase()]

    const bulls = guessChars.filter(
        (char, index) => char === secretChars[index]
    ).length
    const common = guessChars.filter((char) =>
        secretChars.includes(char)
    ).length

    return { bulls, cows: common - bulls }
}
