import * as E3Module from './e3'

Object.defineProperties(self, {
  E3: { value: E3Module.default },
  E3RouterEvent: { value: E3Module.E3RouterEvent },
  E3RouterErrorEvent: { value: E3Module.E3RouterErrorEvent },
})

declare global {
  class E3 extends E3Module.default {}
}
