import { getElapsedMs } from './gameState.js'
import {
    BASES,
    type GameSettings,
    type GameState,
    type RecordEntry,
} from './types.js'

export const TOP_LIMIT = 10

export const addRecord = (
    records: readonly RecordEntry[],
    entry: RecordEntry
): readonly RecordEntry[] => [...records, entry]

const isSameSettings = (a: GameSettings, b: GameSettings): boolean =>
    a.length === b.length && a.base === b.base

const compareRecords = (a: RecordEntry, b: RecordEntry): number =>
    a.attempts - b.attempts || a.timeMs - b.timeMs

export const getTopRecords = (
    records: readonly RecordEntry[],
    settings: GameSettings,
    limit = TOP_LIMIT
): readonly RecordEntry[] =>
    records
        .filter((entry) => isSameSettings(entry.settings, settings))
        .sort(compareRecords)
        .slice(0, limit)

export const createRecord = (state: GameState): RecordEntry | null => {
    const timeMs = getElapsedMs(state)

    if (state.status !== 'won' || timeMs === null) {
        return null
    }

    return { attempts: state.history.length, timeMs, settings: state.settings }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const isRecordEntry = (value: unknown): value is RecordEntry => {
    if (!isObject(value)) {
        return false
    }

    const { attempts, timeMs, settings } = value

    return (
        typeof attempts === 'number' &&
        typeof timeMs === 'number' &&
        isObject(settings) &&
        typeof settings.length === 'number' &&
        Object.values(BASES).some((base) => base === settings.base)
    )
}

export const parseRecords = (json: string | null): readonly RecordEntry[] => {
    if (json === null) {
        return []
    }

    try {
        const data: unknown = JSON.parse(json)

        return Array.isArray(data) ? data.filter(isRecordEntry) : []
    } catch {
        return []
    }
}
