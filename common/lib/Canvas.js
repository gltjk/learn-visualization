export default class Canvas {
  constructor (canvas, {
    axis = true,
    size,
    dash = 8,
    strokeStyle = 'black',
    fillStyle = 'black'
  } = {}) {
    const ctx = this.ctx = canvas.getContext('2d')
    if (!size) size = 512
    this.size = size
    this.dash = dash
    this.axis = axis
    const scale = this.scale = canvas.width / size
    ctx.scale(scale, -scale)
    this.translate(size / 2, -size / 2)
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    this.clear()
  }
  clear () {
    const { ctx, size, axis } = this
    ctx.clearRect(-size / 2, -size / 2, size, size)
    if (axis) this.drawAxis ()
  }
  save () {
    this.ctx.save()
  }
  restore () {
    this.ctx.restore()
  }
  translate (dx, dy) {
    this.ctx.translate(dx, dy)
  }
  drawAxis () {
    const { ctx, size, dash } = this
    const O = {x: 0, y: 0}
    const X = {x: 1, y: 0}
    const Y = {x: 0, y: 1}
    this.line(O, X, true)
    this.line(O, Y, true)
    this.point(O, 'O')
  }
  text (x, y, text, filled = false) {
    const { ctx } = this
    ctx.scale(1, -1)
    ctx.font = `16px serif`
    filled ? ctx.fillText(text, x, -y) : ctx.strokeText(text, x, -y)
    ctx.scale(1, -1)
  }
  line (A, B, dashed = false, strokeStyle) {
    if (A.x === B.x && A.y === B.y) return
    const p = this.size / 2
    const ends = [
      { x: A.x + (p - A.y) / (B.y - A.y) * (B.x - A.x), y: p},
      { x: A.x + (-p - A.y) / (B.y - A.y) * (B.x - A.x), y: -p},
      { x: p, y: A.y + (p - A.x) / (B.x - A.x) * (B.y - A.y) },
      { x: -p, y: A.y + (-p - A.x) / (B.x - A.x) * (B.y - A.y) }
    ]
    ends.forEach(P => this.lineSeg(A, P, dashed, strokeStyle))
  }
  lineSeg ({x: x1, y: y1}, {x: x2, y: y2}, dashed = false, strokeStyle) {
    const { ctx, dash } = this
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    if (dashed) ctx.setLineDash([dash, dash])
    if (strokeStyle) ctx.strokeStyle = strokeStyle
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = this.strokeStyle
  }
  circle (x, y, r, filled = false) {
    const { ctx } = this
    ctx.beginPath()
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2)
    filled ? ctx.fill() : ctx.stroke()
  }
  point ({x, y}, name) {
    this.circle(x, y, 2, true)
    if (name) this.text(x, y, name, true)
  }
  polygon (points, { fillStyle = 'black',
    close = true,
    rule = 'nonzero',
    filled = false
  } = {}) {
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(...points[0])
    points.slice(1).forEach(point => ctx.lineTo(...point))
    if (close) ctx.closePath()
    ctx.fillStyle = fillStyle
    filled ? ctx.fill(rule) : ctx.stroke()
    ctx.fillStyle = this.fillStyle
  }
}
