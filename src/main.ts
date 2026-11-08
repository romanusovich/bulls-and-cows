import { BASES } from './core/types.js'

const root = document.createElement('main')

const title = document.createElement('h1')
title.textContent = 'Bulls and Cows'

const info = document.createElement('p')
info.textContent = `Supported bases: ${Object.keys(BASES).join(', ')}`

root.append(title, info)
document.body.appendChild(root)
