<template>
  <div>
    <main>
      <header class="navigation">
        <div>
          <p class="home"><a href="/">< Home</a></p>
        </div>
        <div>
          <p><a :href="previousLink">Previous</a> | <a :href="nextLink">Next</a></p>
        </div>
      </header>
      <div class="title">
        <h1>{{ slug }}</h1>
        <a :href="sourceLink" target="_blank">Source</a>
      </div>
      <div class="canvasContainer">
        <div ref="canvas" class="canvas"></div>
        <div id="controls" class="controls">
          <h2>Controls</h2>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import p5 from 'p5'
import { ref, onMounted, onUnmounted, defineProps, computed } from 'vue'
import Sketches from '@/sketches'
import Footer from '@/components/Footer.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const canvas = ref(null)
const sketch = ref(null)

const onSketchLoaded = () => {
  canvas.value.style.height = `${sketch.value.height}px`
  canvas.value.style.width = `${sketch.value.width}px`
}

const previousLink = computed(() => {
  const currentIndex = Sketches.findIndex((sketch) => sketch.name === props.slug)
  if (currentIndex === 0) {
    // If first, return last
    return `/sketch/${Sketches[Sketches.length - 1].name}`
  }
  return `/sketch/${Sketches[currentIndex - 1].name}`
})

const nextLink = computed(() => {
  const currentIndex = Sketches.findIndex((sketch) => sketch.name === props.slug)
  if (currentIndex === Sketches.length - 1) {
    // If last, return first
    return `/sketch/${Sketches[0].name}`
  }
  return `/sketch/${Sketches[currentIndex + 1].name}`
})

const sourceLink = computed(() => {
  const sketch = Sketches.find((sketch) => sketch.name === props.slug)
  const slug = sketch.slug ? sketch.slug : sketch.name
  return `https://github.com/lucas-tulio/sketchbook/blob/main/src/sketches/${slug}.js`
})

onMounted(() => {
  const sketchToLoad = Sketches.find((sketch) => sketch.name === props.slug).sketch
  sketch.value = new p5((s) => sketchToLoad(s, onSketchLoaded), canvas.value)
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

h1 {
  margin: 16px 0;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.canvasContainer {
  overflow: hidden;
  border: 4px solid variables.$p5pink;
  border-radius: 4px;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: variables.$contentWidth) {
    flex-direction: column;
    min-width: 800px;
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

header.navigation {
  display: flex;
  justify-content: space-between;
}

p {
  margin: 16px 0;
}

a {
  font-size: 18px;
}
</style>
