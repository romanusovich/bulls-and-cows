import type { BaseValue } from './types.js'

export const getAvailableLengths = (base: BaseValue): readonly number[] => {
    throw new Error(`getAvailableLengths is not implemented (base: ${base})`)
}

export const reduceLength = (length: number, base: BaseValue): number => {
    throw new Error(
        `reduceLength is not implemented (length: ${length}, base: ${base})`
    )
}
