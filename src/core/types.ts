// Система счисления
export const BASES = {
    bin: 2,
    oct: 8,
    dec: 10,
    hex: 16,
} as const

export type BaseName = keyof typeof BASES
export type BaseValue = (typeof BASES)[BaseName]

// Алфавит для всех систем счисления до hex
export const ALPHABET = '0123456789abcdef'

// Ограничения
export const MIN_LENGTH = 2
export const MAX_LENGTH = 6

// Типы для игры
export type Secret = string
export type Guess = string

export interface GameSettings {
    readonly base: BaseValue
    readonly length: number
}

export interface GuessResult {
    readonly bulls: number
    readonly cows: number
}

export interface GuessHistory {
    readonly guess: Guess
    readonly result: GuessResult
}

export type GameStatus = 'playing' | 'won' | 'settings'

export interface GameState {
    readonly status: GameStatus
    readonly settings: GameSettings
    readonly secret: Secret
    readonly history: readonly GuessHistory[]
    readonly startedAt: number | null
    readonly finishedAt: number | null
}

export type GuessRejection = 'not-playing' | 'invalid' | 'duplicate'

export interface RecordEntry {
    readonly attempts: number
    readonly timeMs: number
    readonly settings: GameSettings
}
