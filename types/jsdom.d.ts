declare module 'jsdom' {
  export type DOMWindow = Window & Pick<typeof globalThis, 'Event' | 'MouseEvent' | 'DOMParser'> & { close: () => void }

  export class JSDOM {
    constructor (html?: string)
    readonly window: DOMWindow
  }
}
