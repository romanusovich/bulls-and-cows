export const memoize = <Args extends unknown[], R>(
    fn: (...args: Args) => R
): ((...args: Args) => R) => {
    throw new Error(`memoize is not implemented (${fn.name})`)
}
