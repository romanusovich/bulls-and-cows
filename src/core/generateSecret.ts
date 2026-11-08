import type { BaseValue, Secret } from './types.js'

export const generateSecret = (
    length: number,
    base: BaseValue,
    random: () => number = Math.random
): Secret => {
    throw new Error(
        `generateSecret is not implemented (length: ${length}, base: ${base}, random: ${random.name})`
    )
}
