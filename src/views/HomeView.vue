<template>
  <main>
    <h1 ref="title">_</h1>
    <section ref="list" class="list hidden">
      <SketchListItem v-for="(sketch, index) in Sketches" :key="index" :title="sketch.name" />
    </section>
    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Footer from '@/components/Footer.vue'
import SketchListItem from '@/components/SketchListItem.vue'
import Sketches from '@/sketches'

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
const blinkMs = 500
let blinks = 0
const maxBlinks = 4

onMounted(() => {
  titleInterval = setInterval(() => {
    index.value++
    title.value.innerText = `${word.substring(0, index.value)}_`
    if (index.value >= word.length) {
      titleTimeout = setTimeout(() => {
        title.value.innerHTML = `${word}<br/>_`
        blinkInterval = setInterval(() => {
          title.value.innerHTML = title.value.innerHTML.endsWith('_') ? `${word}<br/>&nbsp;` : `${word}<br/>_`
          blinks++
          if (blinks >= maxBlinks) {
            clearInterval(blinkInterval)
          }
        }, blinkMs)
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
