<template>
  <a :href="`/sketch/${title}`">
    <div class="sketch-item">
      <h2 class="sketch-title">{{ title }}</h2>
      <div
        id="sketch-image"
        class="sketch-image"
        :style="`background-image: url(${imagePath});`"
      ></div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const imagePath = computed(() => {
  try {
    const imageURL = new URL(`../assets/${props.title.toLowerCase()}.png`, import.meta.url)
    return imageURL.href
  } catch (e) {
    console.error(e)
    return null
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss' as variables;

.sketch-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 2rem;
  border: variables.$borderHighlight;
  border-radius: 4px;
  height: 180px;

  .sketch-image {
    position: relative;
    width: 600px;
    height: 100%;
    background-position: center;
    background-size: cover;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, rgba(2, 2, 2, 1), rgba(2, 2, 2, 0));
    }
  }
}
</style>
