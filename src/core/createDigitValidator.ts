import { ALPHABET, type BaseValue } from './types.js'

export const createDigitValidator = (
    base: BaseValue
): ((char: string) => boolean) => {
    const allowedChars = ALPHABET.slice(0, base)
    return (char: string): boolean =>
        char.length === 1 && allowedChars.includes(char.toLowerCase())
}
