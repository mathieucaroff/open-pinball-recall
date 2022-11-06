import { PRNG } from 'seedrandom'
import { Direction } from './type'

export let randomPick = <T>(random: PRNG, array: T[]) => {
  return array[Math.floor(random() * array.length)]
}

// Diagonal down bumper: `\`
export let diagonalDownTurn = (d: Direction): Direction => {
  return {
    up: 'right',
    down: 'left',
    left: 'down',
    right: 'up',
  }[d] as any
}

// Diagonal up bumper: `/`
export let diagonalUpTurn = (d: Direction): Direction => {
  return {
    up: 'left',
    down: 'right',
    left: 'up',
    right: 'down',
  }[d] as any
}
