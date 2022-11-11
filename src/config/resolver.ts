export type DefaultConfigObject<T> = {
  [K in keyof T]: (param: Indirect<T>) => T[K]
}

export type Indirect<T> = {
  [K in keyof T]: () => T[K]
}

export let ensureSpacelessURL = (location: Location) => {
  let spaceLessURL = location.href.replace(/ |%20/g, '')

  if (location.href !== spaceLessURL) {
    location.replace(spaceLessURL)
  }
}

export let resolveConfig = <T>(location: Location, defaultConfig: DefaultConfigObject<T>) => {
  let config: T = {} as any

  // populate config with keys and key-value pairs from the URL
  location.hash
    .split('#')
    .slice(1)
    .forEach((piece) => {
      let key: string
      let valueList: string[]
      let value: any
      if (piece.includes('=')) {
        ;[key, ...valueList] = piece.split('=')
        value = valueList.join('=')
        if (!isNaN(value)) {
          value = +value
        }
      } else {
        key = piece
        value = true
      }

      config[key] = value
    })

  // Prepare for the stacked-config object which returns values from the config
  // when provided and from the executed-default-config otherwise
  let stackedConfig = {} as Indirect<T>

  Object.keys(defaultConfig).forEach((key) => {
    if (key in config) {
      stackedConfig[key] = () => config[key]
    } else {
      stackedConfig[key] = (conf = defaultConfig) => {
        return defaultConfig[key](conf)
      }
    }
  })

  // Execute the default config getters for each missing entry in config
  Object.keys(defaultConfig).forEach((key) => {
    if (!(key in config)) {
      config[key] = defaultConfig[key](stackedConfig)
    }
  })

  return config
}
