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

  stand.start = createStart(config, random)

  let board: pixi.Container
  let bumperContainer: pixi.Container
  let ballContainer: pixi.Container

  let redraw = () => {
    app.stage.removeChildren()
    board = drawBoard(config, layout)
    bumperContainer = drawBumperContainer(config, layout, stand.bumperArray)
    ballContainer = drawBall(config, layout, stand)
    app.stage.addChild(board)
    app.stage.addChild(bumperContainer)
    app.stage.addChild(ballContainer)
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

  // pixi.Ticker.shared.add(() => {
  //   let a = Math.floor((Date.now() * 256) / 1000 / 60) % 256
  //   app.renderer.backgroundColor = a * 0x10101
  // })
}

main()
