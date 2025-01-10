<template>
  <main>
    <h1>collisions.p5</h1>
    <div class="canvasContainer">
      <div ref="canvas" class="canvas"></div>
      <div id="controls" class="controls">
        <h2>Controls</h2>
      </div>
    </div>
    <div class="navigation">
      <div>
        <p><a href="#">Source</a></p>
      </div>
      <div>
        <p><a href="#">Previous</a> | <a href="#">Next</a></p>
      </div>
    </div>
  </main>
</template>

<script setup>
import p5 from 'p5'
import { ref, onMounted, onUnmounted } from 'vue'
import { Collisions } from '@/sketches/Collisions'

const canvas = ref(null)
const sketch = ref(null)

const onSketchLoaded = () => {
  canvas.value.style.height = `${sketch.value.height}px`
  canvas.value.style.width = `${sketch.value.width}px`
}

onMounted(() => {
  sketch.value = new p5((s) => Collisions(s, onSketchLoaded), canvas.value)
})

onUnmounted(() => {
  sketch.value?.remove()
})
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss' as variables;

main {
  width: variables.$contentWidth;
  min-width: variables.$contentWidth;
  margin: auto;
  align-content: center;
}

h1 {
  color: variables.$p5pink;
  font-size: 48px;
}

h2 {
  font-size: 32px;
}

.canvasContainer {
  border: 4px solid variables.$p5pink;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
}

.controls {
  width: 100%;
  border-left: 2px solid variables.$p5pink;
  padding: 0 40px 20px 40px;

  font-size: 24px;
  line-height: 3rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
}
</style>
