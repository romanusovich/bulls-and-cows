import { describe, it, expect } from 'vitest'
import {
    createInitialState,
    getElapsedMs,
    getGuessRejection,
    startGame,
    submitGuess,
} from './gameState.js'
import type { GameSettings, GameState } from './types.js'

const decimal: GameSettings = { length: 4, base: 10 }
const hex: GameSettings = { length: 4, base: 16 }

const playing: GameState = {
    status: 'playing',
    settings: decimal,
    secret: '1234',
    history: [],
    startedAt: 1000,
    finishedAt: null,
}

const playingHex: GameState = {
    status: 'playing',
    settings: hex,
    secret: 'a1b2',
    history: [],
    startedAt: 1000,
    finishedAt: null,
}

describe('createInitialState', () => {
    it('creates a settings-stage state with an empty history', () => {
        expect(createInitialState(decimal)).toEqual({
            status: 'settings',
            settings: decimal,
            secret: '',
            history: [],
            startedAt: null,
            finishedAt: null,
        })
    })
})

describe('startGame', () => {
    it('creates a playing state with the given secret and start time', () => {
        expect(startGame(decimal, '1234', 5000)).toEqual({
            status: 'playing',
            settings: decimal,
            secret: '1234',
            history: [],
            startedAt: 5000,
            finishedAt: null,
        })
    })

    it('rejects a length above 2 for the binary system', () => {
        expect(() => startGame({ length: 3, base: 2 }, '010', 0)).toThrow(
            RangeError
        )
    })

    it('rejects a length outside 2..6', () => {
        expect(() => startGame({ length: 1, base: 10 }, '1', 0)).toThrow(
            RangeError
        )
        expect(() => startGame({ length: 7, base: 16 }, '1234567', 0)).toThrow(
            RangeError
        )
    })

    it('accepts the smallest binary game', () => {
        expect(startGame({ length: 2, base: 2 }, '01', 0).status).toBe(
            'playing'
        )
    })
})

describe('getGuessRejection', () => {
    it('returns null for a valid new guess', () => {
        expect(getGuessRejection(playing, '5678')).toBeNull()
    })

    it('reports not-playing outside of an active round', () => {
        expect(
            getGuessRejection({ ...playing, status: 'settings' }, '5678')
        ).toBe('not-playing')
        expect(getGuessRejection({ ...playing, status: 'won' }, '5678')).toBe(
            'not-playing'
        )
    })

    it('prefers not-playing over invalid', () => {
        expect(getGuessRejection({ ...playing, status: 'won' }, 'zzz')).toBe(
            'not-playing'
        )
    })

    it('reports invalid for a wrong length', () => {
        expect(getGuessRejection(playing, '123')).toBe('invalid')
    })

    it('reports invalid for a character outside the alphabet', () => {
        expect(getGuessRejection(playing, '12a4')).toBe('invalid')
    })

    it('reports invalid for repeated digits', () => {
        expect(getGuessRejection(playing, '1123')).toBe('invalid')
    })

    it('reports duplicate for a guess already in the history', () => {
        const state: GameState = {
            ...playing,
            history: [{ guess: '5678', result: { bulls: 0, cows: 0 } }],
        }
        expect(getGuessRejection(state, '5678')).toBe('duplicate')
    })

    it('treats hex guesses that differ only by case as duplicates', () => {
        const state: GameState = {
            ...playingHex,
            history: [{ guess: 'f2b1', result: { bulls: 1, cows: 2 } }],
        }
        expect(getGuessRejection(state, 'F2B1')).toBe('duplicate')
    })
})

describe('submitGuess', () => {
    it('appends an entry with the evaluated result', () => {
        const next = submitGuess(playing, '1243', 2000)

        expect(next.history).toEqual([
            { guess: '1243', result: { bulls: 2, cows: 2 } },
        ])
        expect(next.status).toBe('playing')
        expect(next.finishedAt).toBeNull()
    })

    it('keeps the rest of the state unchanged', () => {
        const next = submitGuess(playing, '1243', 2000)

        expect(next.settings).toBe(playing.settings)
        expect(next.secret).toBe('1234')
        expect(next.startedAt).toBe(1000)
    })

    it('does not mutate previous states and keeps entries in order', () => {
        const first = submitGuess(playing, '5678', 2000)
        const second = submitGuess(first, '1243', 3000)

        expect(second.history.map((entry) => entry.guess)).toEqual([
            '5678',
            '1243',
        ])
        expect(first.history).toHaveLength(1)
        expect(playing.history).toHaveLength(0)
        expect(second).not.toBe(first)
    })

    it('finishes the game when all digits are bulls', () => {
        const next = submitGuess(playing, '1234', 4500)

        expect(next.status).toBe('won')
        expect(next.finishedAt).toBe(4500)
        expect(next.history).toHaveLength(1)
        expect(next.history[0]?.result.bulls).toBe(4)
    })

    it('stores guesses in lowercase and wins regardless of the input case', () => {
        const next = submitGuess(playingHex, 'A1B2', 3000)

        expect(next.history[0]?.guess).toBe('a1b2')
        expect(next.status).toBe('won')
    })

    it('returns the same state for an invalid guess', () => {
        expect(submitGuess(playing, '12', 2000)).toBe(playing)
        expect(submitGuess(playing, '1123', 2000)).toBe(playing)
    })

    it('returns the same state for a duplicate guess', () => {
        const first = submitGuess(playing, '5678', 2000)

        expect(submitGuess(first, '5678', 3000)).toBe(first)
    })

    it('ignores guesses after the game is won', () => {
        const won = submitGuess(playing, '1234', 2000)

        expect(submitGuess(won, '5678', 3000)).toBe(won)
    })

    it('ignores guesses while the game is not started', () => {
        const idle = createInitialState(decimal)

        expect(submitGuess(idle, '1234', 1000)).toBe(idle)
    })
})

describe('getElapsedMs', () => {
    it('returns the time between start and finish', () => {
        expect(
            getElapsedMs({
                ...playing,
                status: 'won',
                startedAt: 1000,
                finishedAt: 4500,
            })
        ).toBe(3500)
    })

    it('returns null while the game is still running', () => {
        expect(getElapsedMs(playing)).toBeNull()
    })

    it('returns null when the game was never started', () => {
        expect(getElapsedMs(createInitialState(decimal))).toBeNull()
    })
})
