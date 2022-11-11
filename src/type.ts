export type Kind<TName extends string, TProperties extends {} = {}> = TProperties & { kind: TName }

export type Direction = 'up' | 'down' | 'left' | 'right'

export type BumperDirection =
  | 'diagonalUp' // '/'
  | 'diagonalDown' // '\'

export interface Size {
  width: number
  height: number
}

export interface Position {
  x: number
  y: number
}

export type GridPosition = {
  column: number
  row: number
}

export interface Bumper extends Position {
  direction: BumperDirection
}

export type GridDirection = BumperDirection | 'empty'

export type Grid = GridDirection[][]

export type Start = Position & { direction: Direction }

export interface Game {
  grid: Grid
  bumperArray: Bumper[]
  start: Start
  trail: Trail
}

export interface Mark extends Position {
  in: Direction
  out: Direction
}

export type Trail = Mark[]
