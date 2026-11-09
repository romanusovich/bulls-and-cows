import { parseRecords } from '../core/records.js'
import type { RecordEntry } from '../core/types.js'

const STORAGE_KEY = 'bulls-and-cows-records'

export const loadRecords = (): readonly RecordEntry[] => {
    try {
        return parseRecords(localStorage.getItem(STORAGE_KEY))
    } catch {
        return []
    }
}

export const saveRecords = (records: readonly RecordEntry[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch {
        // запрет доступа к localStorage или превышение квоты
        // eslint ругается на пустой catch
    }
}
