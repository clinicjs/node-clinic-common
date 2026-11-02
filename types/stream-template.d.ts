declare module 'stream-template' {
  import { Readable } from 'node:stream'

  function streamTemplate (
    strings: TemplateStringsArray,
    ...interpolations: streamTemplate.Interpolation[]
  ): Readable

  namespace streamTemplate {
    interface Tag {
      (strings: TemplateStringsArray, ...interpolations: Interpolation[]): Readable
    }

    type Interpolation =
      | string
      | null
      | undefined
      | Buffer
      | NodeJS.ReadableStream
      | Promise<Interpolation>
      | ReadonlyArray<Interpolation>

    function encoding (encoding: BufferEncoding): Tag
  }

  export = streamTemplate
}
