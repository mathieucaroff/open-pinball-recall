import { PRNG } from 'seedrandom'
import { Direction } from './type'

export let randomPick = <T>(random: PRNG, array: T[]) => {
  return array[Math.floor(random() * array.length)]
}

export let trigonometricRotationFromDirection = (d: Direction): number => {
  return {
    up: Math.PI,
    down: 0,
    left: Math.PI / 2,
    right: -Math.PI / 2,
  }[d]
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
