import * as pixi from 'pixi.js'
import { default as packageJson } from '../package.json'
import { default as seedrandom } from 'seedrandom'
import { getConfig } from './config/config'
import { drawBoard } from './display/board'
import { getLayout } from './display/layout'
import { githubCornerHTML } from './lib/githubCorner'
import { createStand, createStart } from './logic/generate'
import { drawBumperContainer } from './display/bumper'
import { drawBall } from './display/ball'
import { drawStartArrow } from './display/triangle'
import { drawTrail } from './display/trail'
import { moveFromDirection } from './util'

let main = () => {
  // Github Corner
  document.body.innerHTML += githubCornerHTML(packageJson.repository, packageJson.version)

  // getting the configuration
  let config = getConfig(location)

  let layout = getLayout(config)

  let app = new pixi.Application({
    backgroundColor: config.backgroundColor,
  })
  document.body.appendChild(app.view)
  let redrawTimeout: ReturnType<typeof setTimeout>

  let random = seedrandom(config.seed)
  let stand = createStand(config, random)

  let gameContainer: pixi.Container = new pixi.Container()
  let board: pixi.Container
  let bumperContainer: pixi.Container
  let startArrow: pixi.Container
  let trail: pixi.Container
  let ball: pixi.Container

  app.stage.addChild(gameContainer)

  let redraw = () => {
    board = drawBoard(config, layout)
    bumperContainer = drawBumperContainer(config, layout, stand.bumperArray)
    startArrow = drawStartArrow(config.ballColor, layout.side, stand.start)
    trail = drawTrail(config.trailDotColor, layout, stand.trail)
    ball = drawBall(config, layout, stand)
    ball.visible = false

    gameContainer.x = layout.boardBase.x
    gameContainer.y = layout.boardBase.y

    gameContainer.removeChildren()
    gameContainer.addChild(board)
    gameContainer.addChild(startArrow)
    gameContainer.addChild(trail)
    gameContainer.addChild(bumperContainer)
    gameContainer.addChild(ball)
  }
  redraw()

  let resize = () => {
    layout = getLayout(config)
    app.renderer.resize(layout.width, layout.height)
    clearTimeout(redrawTimeout)
    redrawTimeout = setTimeout(redraw, 100)
  }
  resize()
  window.addEventListener('resize', resize)

  let ballAnimation = true
  let journey = 0

  pixi.Ticker.shared.add(() => {
    let { elapsedMS } = pixi.Ticker.shared

    if (ballAnimation) {
      ball.visible = true

      journey += elapsedMS / 256

      if (journey >= stand.trail.length) {
        ballAnimation = false
      } else {
        // moving the ball
        let mark = stand.trail[journey | 0]
        let diff = Math.abs((journey % 1) - 0.5)
        let direction = journey % 1 < 0.5 ? mark.in : mark.out
        let move = moveFromDirection(direction)
        ball.x = (mark.x + 0.5 + move.x * diff) * layout.side
        ball.y = (mark.y + 0.5 + move.y * diff) * layout.side

        // showing dots
        if (journey % 1 >= 0.25) {
          trail.children[(journey | 0) * 2].visible = true
        }
        if (journey % 1 >= 0.75) {
          trail.children[(journey | 0) * 2 + 1].visible = true
        }
      }
    }
  })
}

main()
