import type { GameSettings, GameState, RecordEntry } from './types.js'

export const TOP_LIMIT = 10

const notImplemented = (name: string): never => {
    throw new Error(`${name} is not implemented`)
}

export const addRecord = (
    records: readonly RecordEntry[],
    entry: RecordEntry
): readonly RecordEntry[] =>
    notImplemented(`addRecord(${records.length}, ${entry.attempts})`)

export const getTopRecords = (
    records: readonly RecordEntry[],
    settings: GameSettings,
    limit = TOP_LIMIT
): readonly RecordEntry[] =>
    notImplemented(
        `getTopRecords(${records.length}, ${settings.length}, ${limit})`
    )

export const createRecord = (state: GameState): RecordEntry | null =>
    notImplemented(`createRecord(${state.status})`)

export const parseRecords = (json: string | null): readonly RecordEntry[] =>
    notImplemented(`parseRecords(${json})`)
