<template>
  <main>
    <h1>{{ slug }}.p5</h1>
    <p class="home"><a href="/">< Home</a></p>
    
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
import { ref, onMounted, onUnmounted, defineProps } from 'vue'
import { useSketchStore } from '@/stores/sketch';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const canvas = ref(null)
const sketch = ref(null)

const sketchStore = useSketchStore()

const onSketchLoaded = () => {
  canvas.value.style.height = `${sketch.value.height}px`
  canvas.value.style.width = `${sketch.value.width}px`
}

onMounted(() => {
  const SketchToLoad = sketchStore.sketches.find((sketch) => sketch.name === props.slug)
  sketch.value = new p5((s) => SketchToLoad(s, onSketchLoaded), canvas.value)
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

  @media screen and (max-width: variables.$contentWidth) {
    width: 808px;
    min-width: 808px;
  }
}

.canvasContainer {
  overflow: hidden;
  border: 4px solid variables.$p5pink;
  border-radius: 4px;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: variables.$contentWidth) {
    flex-direction: column;
  }
}

.controls {
  width: 100%;
  border-left: 2px solid variables.$p5pink;
  padding: 0 40px 20px 40px;

  font-size: 24px;
  line-height: 3rem;

  @media screen and (max-width: variables.$contentWidth) {
    border-left: unset;
    border-top: 2px solid variables.$p5pink;
  }
}

.navigation {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
}

p.home {
  height: 42px;
  font-size: 24px;
}
</style>
