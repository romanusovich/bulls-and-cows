import { describe, it, expect, vi } from 'vitest'
import { memoize } from './memoize.js'

describe('memoize', () => {
    it('returns the same result as the original function', () => {
        const add = memoize((a: number, b: number) => a + b)
        expect(add(2, 3)).toBe(5)
    })

    it('calls the original function once for repeated identical arguments', () => {
        const fn = vi.fn((a: number, b: number) => a + b)
        const memoized = memoize(fn)

        memoized(2, 3)
        memoized(2, 3)
        memoized(2, 3)

        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('calls the original function again for different arguments', () => {
        const fn = vi.fn((a: number, b: number) => a + b)
        const memoized = memoize(fn)

        memoized(1, 2)
        memoized(2, 1)
        memoized(3, 4)

        expect(fn).toHaveBeenCalledTimes(3)
    })

    it('keeps results of different arguments apart', () => {
        const subtract = memoize((a: number, b: number) => a - b)

        expect(subtract(5, 2)).toBe(3)
        expect(subtract(2, 5)).toBe(-3)
        expect(subtract(5, 2)).toBe(3)
    })

    it('does not mix up arguments that look alike when concatenated', () => {
        const fn = vi.fn((a: number, b: number) => `${a}:${b}`)
        const memoized = memoize(fn)

        expect(memoized(1, 23)).toBe('1:23')
        expect(memoized(12, 3)).toBe('12:3')
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('caches falsy results such as 0', () => {
        const fn = vi.fn((x: number) => (x > 0 ? x : 0))
        const memoized = memoize(fn)

        expect(memoized(0)).toBe(0)
        expect(memoized(0)).toBe(0)
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('caches undefined results', () => {
        const fn = vi.fn((): undefined => undefined)
        const memoized = memoize(fn)

        memoized()
        memoized()

        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('keeps separate caches for separate memoized functions', () => {
        const fnA = vi.fn((x: number) => x + 1)
        const fnB = vi.fn((x: number) => x + 1)
        const a = memoize(fnA)
        const b = memoize(fnB)

        a(1)
        b(1)

        expect(fnA).toHaveBeenCalledTimes(1)
        expect(fnB).toHaveBeenCalledTimes(1)
    })
})
