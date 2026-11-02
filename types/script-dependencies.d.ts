declare module 'browserify' {
  import { Readable, Transform } from 'node:stream'

  namespace browserify {
    type TransformFactory = (file: string, options?: Record<string, unknown>) => Transform
    type TransformInput = string | TransformFactory | Transform
    type Plugin = string | ((bundler: Bundler, options?: Record<string, unknown>) => void)

    interface Bundler {
      add(file: string | string[], options?: Record<string, unknown>): this
      require(file: string | string[], options?: Record<string, unknown>): this
      transform(transform: TransformInput, options?: Record<string, unknown>): this
      plugin(plugin: Plugin, options?: Record<string, unknown>): this
      external(file: string | string[], options?: Record<string, unknown>): this
      exclude(file: string | string[], options?: Record<string, unknown>): this
      ignore(file: string | string[], options?: Record<string, unknown>): this
      bundle(callback?: (error: Error | null, data?: Buffer) => void): Readable
    }

    interface Options {
      basedir?: string
      debug?: boolean
      noParse?: string[]
    }
  }

  function browserify(options?: browserify.Options): browserify.Bundler
  export = browserify
}

declare module 'brfs' {
  import { Transform } from 'node:stream'

  function brfs(file: string, options?: Record<string, unknown>): Transform
  export = brfs
}

declare module 'loose-envify/custom' {
  import { Transform } from 'node:stream'

  type EnvironmentValue = string | number | boolean
  function custom(environment: Record<string, EnvironmentValue>): (file: string, options?: Record<string, unknown>) => Transform
  export = custom
}

declare module 'postcss-import' {
  import type { Plugin } from 'postcss'

  function postcssImport(): Plugin
  export = postcssImport
}
