import * as pixi from 'pixi.js'
import { default as packageJson } from '../package.json'
import { default as seedrandom } from 'seedrandom'
import { getConfig } from './config/config'
import { drawBoard } from './display/board'
import { getLayout } from './display/layout'
import { githubCornerHTML } from './lib/githubCorner'
import { createStand } from './logic/generate'
import { drawBumperArray } from './display/bumper'

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

  let redraw = () => {
    app.stage.children[0] = drawBoard(config, layout)
    app.stage.children[0].parent = app.stage
    app.stage.children[1] = drawBumperArray(config, layout, stand.bumperArray)
    app.stage.children[1].parent = app.stage
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

  pixi.Ticker.shared.add(() => {
    let a = Math.floor((Date.now() * 256) / 1000 / 60) % 256
    app.renderer.backgroundColor = a * 0x10101
  })
}

main()
