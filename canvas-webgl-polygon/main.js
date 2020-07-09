import { $ } from '../common/lib/utils.js'
import Vector2D from '../common/lib/Vector2D.js'
import Canvas from '../common/lib/Canvas.js'
import WebGL from '../common/lib/WebGL.js'

const canvas = new Canvas($('#canvas'), { axis: false })
const canvasGl = new WebGL($('#webgl'))

// 正五边形
const pentagon = [new Vector2D(0, 100)]
for (let i = 1; i <= 4; i++) {
  const p = pentagon[0].rotate(i * Math.PI * 0.4)
  pentagon.push(p)
}
// 正五角星
const star = [0, 2, 4, 1, 3].map(i => pentagon[i])
// 菱形星星
const sparkle = [new Vector2D(0, 100)]
for (let i = 1; i <= 7; i++) {
  const p = sparkle[0].rotate(i * Math.PI * 0.25)
  if (i % 2 === 1) sparkle.push(p.scale(0.5))
  else sparkle.push(p)
}
// 圆（第一象限）
const quarterCircle = [new Vector2D(100, 0)]
for (let angle = 0; angle < 90; angle  += 10) {
  const t = angle / 180 * Math.PI
  quarterCircle.push(quarterCircle[0].rotate(t))
}
// 圆
const circle = [...quarterCircle]
for (let i = 1; i <= 3; i++) {
  const rotated = quarterCircle.map(x => x.rotate(i * Math.PI * 0.5))
  circle.push(...rotated)
}
// 好看的菱形星星
const betterSparkle = []
const translation = [
  [-100, -100],
  [-100, 100],
  [100, 100],
  [100, -100]
]
for (let i = 0; i <= 3; i++) {
  const rotated = quarterCircle.map(x => x.rotate(i * Math.PI * -0.5).translate(...translation[i]))
  betterSparkle.push(...rotated)
}
// 椭圆（极坐标法）
const a = 200, b = 100
const c = (a ** 2 - b ** 2) ** 0.5 // 半焦距
const ellipse = [new Vector2D(a + c, 0)]
for (let angle = 1; angle < 360; angle += 1) {
  const t = angle / 180 * Math.PI
  const rou = b ** 2 / (a - c * Math.cos(t)) / (a + c)
  ellipse.push(ellipse[0].rotate(t).scale(rou))
}
ellipse.forEach((x, i) => ellipse[i] = x.translate(-c, 0))
// 椭圆（圆拉伸法）
const ellipse1 = [new Vector2D(b, 0)]
for (let angle = 1; angle < 360; angle += 10) {
  const t = angle / 180 * Math.PI
  ellipse1.push(ellipse1[0].rotate(t))
}
ellipse1.forEach((x, i) => x.x = x.x / b * a)

const buttons = [
  ['正五边形', pentagon],
  ['正五角星', star],
  ['空心正五角星', star, ['evenodd', 'ODD']],
  ['圆（正三十六边形模拟）', circle],
  ['菱形星星', sparkle],
  ['好看的菱形星星', betterSparkle],
  ['椭圆（极坐标法）', ellipse],
  ['椭圆（圆拉伸法）', ellipse1],
]

buttons.forEach(x => {
  const btn = document.createElement('button')
  btn.innerHTML = x[0]
  btn.addEventListener('click', () => {
    canvas.clear()
    canvasGl.clear()
    canvas.polygon(x[1], {
      filled: true,
      rule: x[2] ? x[2][0] : undefined
    })
    canvasGl.polygon(x[1], {
      rule: x[2] ? x[2][1] : undefined
    })
  })
  $('#buttons').appendChild(btn)
})
