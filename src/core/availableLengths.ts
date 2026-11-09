import { MAX_LENGTH, MIN_LENGTH, type BaseValue } from './types.js'

const getMaxLength = (base: BaseValue): number => Math.min(MAX_LENGTH, base)

export const getAvailableLengths = (base: BaseValue): readonly number[] =>
    Array.from(
        { length: getMaxLength(base) - MIN_LENGTH + 1 },
        (_, index) => MIN_LENGTH + index
    )

export const reduceLength = (length: number, base: BaseValue): number =>
    Math.min(Math.max(length, MIN_LENGTH), getMaxLength(base))
