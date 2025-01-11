import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SketchView from '@/views/SketchView.vue'
import { useSketchStore } from '@/stores/sketch'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sketch/:slug?',
      name: 'sketch',
      component: SketchView,
      props: true,
      beforeEnter: (to, _from, next) => {
        const sketchStore = useSketchStore()
        const validSketches = sketchStore.sketches.map((sketch) => sketch.name.toLocaleLowerCase())
        const slug = to.params.slug
        if (!slug || !validSketches.includes(slug.toLocaleLowerCase())) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
