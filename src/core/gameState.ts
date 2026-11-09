import { evaluateGuess } from './evaluateGuess.js'
import { getAvailableLengths } from './availableLengths.js'
import { isValidGuess } from './isValidGuess.js'
import type {
    GameSettings,
    GameState,
    Guess,
    GuessRejection,
    GuessHistory,
    Secret,
} from './types.js'

export const createInitialState = (settings: GameSettings): GameState => ({
    status: 'settings',
    settings,
    secret: '',
    history: [],
    startedAt: null,
    finishedAt: null,
})

export const startGame = (
    settings: GameSettings,
    secret: Secret,
    now: number
): GameState => {
    if (!getAvailableLengths(settings.base).includes(settings.length)) {
        throw new RangeError(
            `Length ${settings.length} is not available for base ${settings.base}`
        )
    }

    return {
        status: 'playing',
        settings,
        secret,
        history: [],
        startedAt: now,
        finishedAt: null,
    }
}

export const getGuessRejection = (
    state: GameState,
    guess: Guess
): GuessRejection | null => {
    if (state.status !== 'playing') {
        return 'not-playing'
    }

    if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
        return 'invalid'
    }

    const normalized = guess.toLowerCase()

    return state.history.some((entry) => entry.guess === normalized)
        ? 'duplicate'
        : null
}

export const submitGuess = (
    state: GameState,
    guess: Guess,
    now: number
): GameState => {
    if (getGuessRejection(state, guess) !== null) {
        return state
    }

    const normalized = guess.toLowerCase()
    const result = evaluateGuess(state.secret, normalized)
    const entry: GuessHistory = { guess: normalized, result }
    const isWon = result.bulls === state.settings.length

    return {
        ...state,
        status: isWon ? 'won' : 'playing',
        history: [...state.history, entry],
        finishedAt: isWon ? now : null,
    }
}

export const getElapsedMs = (state: GameState): number | null =>
    state.startedAt === null || state.finishedAt === null
        ? null
        : state.finishedAt - state.startedAt
