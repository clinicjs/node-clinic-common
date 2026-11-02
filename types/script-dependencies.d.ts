declare module 'brfs' {
  import { Transform } from 'node:stream'

  function brfs(file: string, options?: Record<string, unknown>): Transform
  export = brfs
}

declare module 'postcss-import' {
  import type { Plugin } from 'postcss'

  function postcssImport(): Plugin
  export = postcssImport
}
