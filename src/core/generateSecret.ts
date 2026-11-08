import { ALPHABET, type BaseValue, type Secret } from './types.js'

export const generateSecret = (
    length: number,
    base: BaseValue,
    random: () => number = Math.random
): Secret => {
    if (length > base) {
        throw new RangeError(
            `Cannot pick ${length} unique digits from base ${base}`
        )
    }

    const pick = (
        pool: readonly string[],
        count: number
    ): readonly string[] => {
        if (count === 0) {
            return []
        }

        const index = Math.floor(random() * pool.length)
        const chosen = pool.slice(index, index + 1)
        const rest = pool.filter((_, position) => position !== index)

        return [...chosen, ...pick(rest, count - 1)]
    }

    return pick([...ALPHABET.slice(0, base)], length).join('')
}
