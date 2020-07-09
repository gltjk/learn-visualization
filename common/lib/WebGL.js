function loadShader (gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initShaderProgram (gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.warn('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }
  return shaderProgram
}

function hex2rgba (hex) {
  if (!hex.match(/#[0-9A-F]{8}/)) return null
  return [1, 3, 5, 7].map(x => parseInt(hex.slice(x, x + 2), 16) / 255)
}

const { tesselate, WINDING, ELEMENT } = Tess2

function polygonToTriangles (points, { rule = 'NONZERO' }) {
  if (WINDING[rule] === undefined) rule = 'NONZERO'
  const res = tesselate({
    contours: [points.flat()],
    windingRule: WINDING[rule],
    elementType: ELEMENT.POLYGONS,
    polySize: 3,
    vertexSize: 2,
    strict: false
  })
  const triangles = []
  for (var i = 0; i < res.elements.length; i += 3) {
    const a = res.elements[i]
    const b = res.elements[i + 1]
    const c = res.elements[i + 2]
    triangles.push([
      [res.vertices[a * 2], res.vertices[a * 2 + 1]],
      [res.vertices[b * 2], res.vertices[b * 2 + 1]],
      [res.vertices[c * 2], res.vertices[c * 2 + 1]]
    ])
  }
  return triangles
}

export default class WebGL {
  constructor (canvas, {
    size,
    color = '#000000FF',
    bgColor = '#FFFFFFFF'
  } = {}) {
    if (!size) size = 512
    this.bgColor = [1, 3, 5, 7].map(x => parseInt(bgColor.slice(x, x + 2), 16) / 255)
    this.color = [1, 3, 5, 7].map(x => parseInt(color.slice(x, x + 2), 16) / 255)
    const gl = this.gl = canvas.getContext('webgl')
    // gl.viewport(0, 0, size, size)
    this.init({ color, size })
    this.clear()
  }
  init ({ color, size }) {
    const colorArray = Array.isArray(color) ? color : (hex2rgba(color) || this.color)
    this.size = size || 512
    const vertex = `
      attribute vec2 position;
      void main() {
        gl_PointSize = 1.0;
        gl_Position = vec4(position, 1.0, ${(this.size / 2).toFixed(1)});
      }
    `
    const fragment = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(${colorArray.map(x => x.toFixed(1)).join(',')});
      }
    `
    this.program = initShaderProgram (this.gl, vertex, fragment)
    this.gl.useProgram(this.program)
  }
  buffer (data) {
    const { gl } = this
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data),
      gl.STATIC_DRAW
    )
  }
  clear () {
    const { gl, bgColor } = this
    gl.clearColor(...bgColor)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }
  line (x1, y1, x2, y2) {
    const data = [x1, y1, x2, y2]
    const { gl, program }= this
    this.buffer(data)
    const vPosition = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)
    gl.drawArrays(gl.TRIANGLES, 0, data.length /2 )
  }
  triangle (points, { color = this.color } = {}) {
    this.init({ color })
    const { gl, program }= this
    this.buffer(points.flat())
    const vPosition = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)
    gl.drawArrays(gl.TRIANGLES, 0, points.length)
  }
  polygon (points, {
    color = this.color,
    rule = 'NONEZERO'
  } = {}) {
    const triangles = polygonToTriangles(points, { rule })
    triangles.forEach(t => this.triangle(t, { color }))
  }
}
