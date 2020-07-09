export default class Vector extends Array {
  constructor (x = 0, y = 0, z = 0) {
    if (isNaN(z)) super(x, y)
    else super(x, y, z)
  }
  set x (v) {
    this[0] = v
  }
  set y (v) {
    this[1] = v
  }
  set z (v) {
    this[2] = v
  }
  get x () {
    return this[0]
  }
  get y () {
    return this[1]
  }
  get z () {
    return this[2]
  }
  get modular () {
    return Math.hypot(this.x, this.y, this.z)
  }
  get dir () {
    return Math.atan2(this.y, this.x)
  }
  translate (x = 0, y = 0, z = 0) {
    return this.add(new Vector(x, y, z))
  }
  scale (n) {
    return new Vector(this.x * n, this.y * n, this.z * n)
  }
  clone () {
    return this.scale(1)
  }
  reverse () {
    return this.scale(-1)
  }
  normalize () {
    return this.scale(1 / this.length)
  }
  add (v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z)
  }
  minus (v) {
    return this.add(v.reverse())
  }
  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
  cross (v) {
    return this.x * v.y - this.y * v.x
  }
}
