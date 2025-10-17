import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   /* {
      path: '/',
      name: 'home',
      component: HomeView,
    },*/
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/pages/home.vue'),
    },
    {
      path: '/Destacados',
      name: 'Destacados',
      component: () => import('../views/pages/destacados.vue'),
    },
    {
      path: '/Papelera',
      name: 'Papelera',
      component: () => import('../views/pages/papelera.vue'),
    },
  ],
})

export default router
