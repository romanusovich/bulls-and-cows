import { describe, it, expect } from 'vitest'
import {
    addRecord,
    createRecord,
    getTopRecords,
    parseRecords,
} from './records.js'
import type { GameSettings, GameState, RecordEntry } from './types.js'

const decimal: GameSettings = { length: 4, base: 10 }
const binary: GameSettings = { length: 2, base: 2 }

const record = (
    attempts: number,
    timeMs: number,
    settings: GameSettings = decimal
): RecordEntry => ({ attempts, timeMs, settings })

describe('addRecord', () => {
    it('appends the entry to the end', () => {
        const result = addRecord([record(5, 1000)], record(3, 2000))

        expect(result).toEqual([record(5, 1000), record(3, 2000)])
    })

    it('does not mutate the original list', () => {
        const original = [record(5, 1000)]

        const result = addRecord(original, record(3, 2000))

        expect(original).toHaveLength(1)
        expect(result).not.toBe(original)
    })

    it('works with an empty list', () => {
        expect(addRecord([], record(3, 2000))).toEqual([record(3, 2000)])
    })
})

describe('getTopRecords', () => {
    const attemptsOf = (records: readonly RecordEntry[]) =>
        records.map((entry) => entry.attempts)

    it('returns an empty list when there are no records', () => {
        expect(getTopRecords([], decimal)).toEqual([])
    })

    it('keeps only records with the same length and base', () => {
        const records = [
            record(5, 1000, decimal),
            record(2, 1000, { length: 3, base: 10 }),
            record(1, 1000, binary),
            record(4, 1000, { length: 4, base: 16 }),
        ]

        expect(getTopRecords(records, decimal)).toEqual([
            record(5, 1000, decimal),
        ])
    })

    it('sorts by the number of attempts, fewer first', () => {
        const records = [record(7, 1000), record(3, 1000), record(5, 1000)]

        expect(attemptsOf(getTopRecords(records, decimal))).toEqual([3, 5, 7])
    })

    it('breaks ties by time, faster first', () => {
        const records = [record(5, 9000), record(5, 4000)]

        expect(
            getTopRecords(records, decimal).map((entry) => entry.timeMs)
        ).toEqual([4000, 9000])
    })

    it('ranks attempts above time', () => {
        const records = [record(4, 1000), record(3, 99000)]

        expect(attemptsOf(getTopRecords(records, decimal))).toEqual([3, 4])
    })

    it('respects the given limit and keeps the best ones', () => {
        const records = [
            record(5, 0),
            record(1, 0),
            record(4, 0),
            record(2, 0),
            record(3, 0),
        ]

        expect(attemptsOf(getTopRecords(records, decimal, 3))).toEqual([
            1, 2, 3,
        ])
    })

    it('shows the top 10 by default', () => {
        const records = Array.from({ length: 12 }, (_, index) =>
            record(12 - index, 1000)
        )

        const top = getTopRecords(records, decimal)

        expect(top).toHaveLength(10)
        expect(attemptsOf(top)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })

    it('does not mutate the original list', () => {
        const records = [record(7, 1000), record(3, 1000), record(5, 1000)]

        getTopRecords(records, decimal)

        expect(attemptsOf(records)).toEqual([7, 3, 5])
    })
})

describe('createRecord', () => {
    const won: GameState = {
        status: 'won',
        settings: decimal,
        secret: '1234',
        history: [
            { guess: '5678', result: { bulls: 0, cows: 0 } },
            { guess: '1243', result: { bulls: 2, cows: 2 } },
            { guess: '1234', result: { bulls: 4, cows: 0 } },
        ],
        startedAt: 1000,
        finishedAt: 4500,
    }

    it('builds a record from a won game', () => {
        expect(createRecord(won)).toEqual({
            attempts: 3,
            timeMs: 3500,
            settings: decimal,
        })
    })

    it('returns null while the game is being played', () => {
        expect(
            createRecord({ ...won, status: 'playing', finishedAt: null })
        ).toBeNull()
    })

    it('returns null when the game was not started', () => {
        expect(
            createRecord({
                ...won,
                status: 'settings',
                history: [],
                startedAt: null,
                finishedAt: null,
            })
        ).toBeNull()
    })
})

describe('parseRecords', () => {
    it('returns an empty list when nothing is stored', () => {
        expect(parseRecords(null)).toEqual([])
    })

    it('restores records that were saved as JSON', () => {
        const records = [record(3, 1000), record(5, 2000, binary)]

        expect(parseRecords(JSON.stringify(records))).toEqual(records)
    })

    it('returns an empty list for an empty array', () => {
        expect(parseRecords('[]')).toEqual([])
    })

    it('returns an empty list for broken JSON', () => {
        expect(parseRecords('{oops')).toEqual([])
    })

    it('returns an empty list when the data is not an array', () => {
        expect(parseRecords('{"a":1}')).toEqual([])
        expect(parseRecords('null')).toEqual([])
        expect(parseRecords('42')).toEqual([])
    })

    it('skips malformed entries and keeps the valid ones', () => {
        const stored = JSON.stringify([
            record(3, 1000),
            { attempts: '3', timeMs: 1000, settings: decimal },
            { attempts: 3, timeMs: 1000 },
            { attempts: 3, timeMs: 1000, settings: { length: 4, base: 7 } },
            42,
            null,
        ])

        expect(parseRecords(stored)).toEqual([record(3, 1000)])
    })
})
