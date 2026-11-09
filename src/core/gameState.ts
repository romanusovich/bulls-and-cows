import type {
    GameSettings,
    GameState,
    Guess,
    GuessRejection,
    Secret,
} from './types.js'

const notImplemented = (name: string): never => {
    throw new Error(`${name} is not implemented`)
}

export const createInitialState = (settings: GameSettings): GameState =>
    notImplemented(`createInitialState(${settings.length})`)

export const startGame = (
    settings: GameSettings,
    secret: Secret,
    now: number
): GameState =>
    notImplemented(`startGame(${settings.length}, ${secret}, ${now})`)

export const getGuessRejection = (
    state: GameState,
    guess: Guess
): GuessRejection | null =>
    notImplemented(`getGuessRejection(${state.status}, ${guess})`)

export const submitGuess = (
    state: GameState,
    guess: Guess,
    now: number
): GameState => notImplemented(`submitGuess(${state.status}, ${guess}, ${now})`)

export const getElapsedMs = (state: GameState): number | null =>
    notImplemented(`getElapsedMs(${state.status})`)
