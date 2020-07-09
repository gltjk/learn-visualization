import Vector from './Vector.js'

export default class Vector2D extends Vector {
  constructor (x = 0, y = 0) {
    super(x, y, NaN)
  }
  get z () {
    return 0
  }
  get dir () {
    return Math.atan2(this.y, this.x)
  }
  translate (x = 0, y = 0) {
    return this.add(new Vector2D(x, y))
  }
  scale (n) {
    return new Vector2D(this.x * n, this.y * n)
  }
  add (v) {
    return new Vector2D(this.x + v.x, this.y + v.y)
  }
  cross (v) {
    return this.x * v.y - this.y * v.x
  }
  rotate(rad) {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const [x, y] = this
    return  new Vector2D(
      x * c + y * -s,
      x * s + y * c
    )
  }
}
