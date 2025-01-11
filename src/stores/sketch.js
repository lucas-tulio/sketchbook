import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Sketches from '@/sketches'

export const useSketchStore = defineStore('sketchStore', () => {
  const sketches = ref(Sketches.all)
  return { sketches }
})
