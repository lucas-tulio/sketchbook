<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }" >
    <Transition name="fade" mode="in-out">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
