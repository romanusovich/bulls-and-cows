import type { BaseValue } from './types.js'

export const createDigitValidator = (
    base: BaseValue
): ((char: string) => boolean) => {
    throw new Error(`createDigitValidator is not implemented (base: ${base})`)
}
