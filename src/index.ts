import * as _ from './e3'

Object.defineProperties(self, {
  E3: { value: _.default },
  E3RouterEvent: { value: _.E3RouterEvent },
  E3RouterErrorEvent: { value: _.E3RouterErrorEvent },
})

declare global {
  class E3 extends _.default {}
  class E3RouterEvent extends _.E3RouterEvent {}
  class E3RouterErrorEvent extends _.E3RouterErrorEvent {}
}
