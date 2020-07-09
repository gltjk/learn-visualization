import { $, $$ } from '../common/lib/utils.js'
import Vector2D from '../common/lib/Vector2D.js'
import Canvas from '../common/lib/Canvas.js'

const coordinates = [0, 0, -100, 0, 100, 0]
const c = new Canvas($('canvas'), { axis: false })
const d = dist.bind(c)
d(0, 0, -100, 0, 100, 0)
c.ctx.canvas.addEventListener('mousemove', mouseMove)

function mouseMove(e) {
  const { ctx, scale, size } = c
  const { canvas } = ctx
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left) * (canvas.width / rect.width) / scale - size / 2
  const y = size / 2 - (e.clientY - rect.top) * (canvas.height / rect.height) / scale
  const point = [...$$('[name=point]')].find(x => x.checked).value
  if (point === 'P') {
    coordinates[0] = x
    coordinates[1] = y
  } else if (point === 'Q') {
    coordinates[2] = x
    coordinates[3] = y
  } else {
    coordinates[4] = x
    coordinates[5] = y
  }
  c.clear()
  $('#dist1').innerHTML = d(...coordinates, true)
  $('#dist2').innerHTML = d(...coordinates)
  $('#P').innerHTML = coordinates.slice(0, 2)
  $('#Q').innerHTML = coordinates.slice(2, 4)
  $('#R').innerHTML = coordinates.slice(4)
}

function dist(x0, y0, x1, y1, x2, y2, seg = false) {
  const canvas = this
  const P = new Vector2D(x0, y0)
  const Q = new Vector2D(x1, y1)
  const R = new Vector2D(x2, y2)
  const QR = R.minus(Q)
  const QP = P.minus(Q)
  const RP = P.minus(R)
  const N = QR.modular === 0 ? Q.scale(1) : new Vector2D(
    P.x * QR.x ** 2 + Q.x * QR.y ** 2 + QR.x * QR.y * (P.y - Q.y),
    P.y * QR.y ** 2 + Q.y * QR.x ** 2 + QR.x * QR.y * (P.x - Q.x)
    ).scale(1 / QR.modular ** 2)
  const PN = N.minus(P)
  if (!seg) return QP.cross(QR) / QR.modular
  canvas.point(P, 'P')
  canvas.point(Q, 'Q')
  canvas.point(R, 'R ')
  canvas.line(Q, R)
  canvas.lineSeg(Q, R, false, 'blue')
  if (QR.modular === 0) {
    canvas.lineSeg(N, P)
    return QP.modular
  }
  if (PN.modular > 0) canvas.point(N, 'N')
  const dotProduct = QR.dot(QP) / QR.modular
  if (dotProduct < 0) {
    canvas.lineSeg(N, P, true, 'green')
    canvas.lineSeg(P, Q, false, 'red')
    return QP.modular
  }
  if (dotProduct > QR.modular) {
    canvas.lineSeg(N, P, true, 'green')
    canvas.lineSeg(P, R, false, 'red')
    return RP.modular
  }
  canvas.lineSeg(P, N, false, 'red')
  return QP.cross(QR) / QR.modular
}
