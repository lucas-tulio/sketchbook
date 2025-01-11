<template>
  <main>
    <h1 ref="title">_</h1>
    <section ref="list" class="list hidden">
      <SketchListItem
        v-for="(sketch, index) in sketchStore.sketches"
        :key="index"
        :title="sketch.name"
      />
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SketchListItem from '@/components/SketchListItem.vue'
import { useSketchStore } from '@/stores/sketch'

const sketchStore = useSketchStore()

const title = ref(null)
const list = ref(null)

let titleInterval
let titleTimeout
let listTimeout
let blinkInterval

const word = 'sketches.p5'
const index = ref(-1)
const typingMs = 50
const enterMs = 100
const listDisplayMs = 1000

onMounted(() => {
  titleInterval = setInterval(() => {
    index.value++
    title.value.innerText = `${word.substring(0, index.value)}_`
    if (index.value >= word.length) {
      titleTimeout = setTimeout(() => {
        title.value.innerHTML = `${word}<br/>_`
      }, enterMs)
      clearInterval(titleInterval)
    }
  }, typingMs)
  listTimeout = setTimeout(() => {
    list.value.classList.remove('hidden')
  }, listDisplayMs)
})

onBeforeUnmount(() => {
  clearInterval(titleInterval)
  clearTimeout(titleTimeout)
  clearTimeout(listTimeout)
  clearInterval(blinkInterval)
})
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 40px;
  opacity: 1;
  transition: all 0.3s ease-in-out;

  &.hidden {
    opacity: 0;
  }
}
</style>
