const { createApp, ref, reactive, computed, toRefs } = Vue

createApp({
  setup() {
    const links = ref([
      ['点到线段/直线的距离', 'point-line-distance'],
      ['用 Canvas 和 WebGL 画多边形', 'canvas-webgl-polygon']
    ])
    return {
      links
    }
  }
}).mount('#app')
