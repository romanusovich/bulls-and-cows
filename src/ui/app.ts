import { reduceLength, getAvailableLengths } from '../core/availableLengths.js'
import { countPossibleSecrets } from '../core/countPossibleSecrets.js'
import { createDigitValidator } from '../core/createDigitValidator.js'
import {
    createInitialState,
    getElapsedMs,
    getGuessRejection,
    startGame,
    submitGuess,
} from '../core/gameState.js'
import { generateSecret } from '../core/generateSecret.js'
import { BASES, type GameSettings, type GameState } from '../core/types.js'
import { el } from './dom.js'

const root = el('main')

let state: GameState = createInitialState({ length: 4, base: 10 })

const setState = (next: GameState): void => {
    state = next
    render()
}

const option = (
    value: string,
    label: string,
    selected: boolean
): HTMLOptionElement => {
    const node = el('option', label)
    node.value = value
    node.selected = selected
    return node
}

const renderSettings = (): HTMLElement => {
    const { length, base } = state.settings
    const locked = state.status !== 'settings'

    const changeSettings = (settings: GameSettings): void =>
        setState(createInitialState(settings))

    const baseSelect = el(
        'select',
        '',
        ...Object.entries(BASES).map(([name, value]) =>
            option(String(value), name, value === base)
        )
    )
    baseSelect.disabled = locked
    baseSelect.addEventListener('change', () => {
        const newBase = Object.values(BASES).find(
            (value) => String(value) === baseSelect.value
        )

        if (newBase !== undefined) {
            changeSettings({
                base: newBase,
                length: reduceLength(length, newBase),
            })
        }
    })

    const lengthSelect = el(
        'select',
        '',
        ...getAvailableLengths(base).map((n) =>
            option(String(n), String(n), n === length)
        )
    )
    lengthSelect.disabled = locked
    lengthSelect.addEventListener('change', () => {
        changeSettings({ base, length: Number(lengthSelect.value) })
    })

    const section = el(
        'section',
        '',
        el('h2', 'Настройки'),
        el('label', 'Система: ', baseSelect),
        el('label', ' Длина: ', lengthSelect),
        el('p', `Возможных секретов: ${countPossibleSecrets(length, base)}`)
    )

    if (!locked) {
        const startButton = el('button', 'Начать')
        startButton.addEventListener('click', () => {
            setState(
                startGame(
                    state.settings,
                    generateSecret(length, base),
                    Date.now()
                )
            )
        })
        section.append(startButton)
    }

    return section
}

const renderGuessForm = (): HTMLElement => {
    const { length, base } = state.settings
    const isDigit = createDigitValidator(base)

    const input = el('input')
    input.maxLength = length
    input.autocomplete = 'off'
    input.addEventListener('input', () => {
        input.value = [...input.value].filter(isDigit).join('')
    })

    const note = el('p')
    const form = el('form', '', input, el('button', 'Проверить'), note)

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const reason = getGuessRejection(state, input.value)

        if (reason === null) {
            setState(submitGuess(state, input.value, Date.now()))
        } else {
            note.textContent =
                reason === 'duplicate'
                    ? 'Такая попытка уже была'
                    : `Нужно ввести ${length} разных цифр`
        }
    })

    return form
}

const renderGame = (): HTMLElement => {
    const section = el('section', '', el('h2', 'Игра'))

    if (state.status === 'playing') {
        section.append(renderGuessForm())
    }

    if (state.status === 'won') {
        const seconds = ((getElapsedMs(state) ?? 0) / 1000).toFixed(1)
        section.append(
            el(
                'p',
                `Вы угадали! Попыток: ${state.history.length}, время: ${seconds} с`
            )
        )
    }

    const history = state.history.map((entry) =>
        el(
            'li',
            `${entry.guess} — bulls: ${entry.result.bulls}, cows: ${entry.result.cows}`
        )
    )
    section.append(el('ol', '', ...history))

    const newGameButton = el('button', 'Новая игра')
    newGameButton.addEventListener('click', () =>
        setState(createInitialState(state.settings))
    )
    section.append(newGameButton)

    return section
}

const render = (): void => {
    root.replaceChildren(
        el('h1', 'Bulls and Cows'),
        renderSettings(),
        ...(state.status === 'settings' ? [] : [renderGame()])
    )
    root.querySelector('input')?.focus()
}

export const startApp = (): void => {
    document.body.append(root)
    render()
}
