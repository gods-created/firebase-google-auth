import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/components/Auth.vue';
import DashboardView from '@/components/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'auth',
      path: '/auth',
      component: AuthView,
      props: true
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: DashboardView,
      props: true
    },
  ],
  scrollBehavior() {
    return {top: 0}
  }
})

router.beforeEach((to, from, next) => {
  const allowedRoutes = ['auth', 'dashboard'];
  if (!allowedRoutes.includes(to.name)) {
    return next({name: 'auth'});
  }

  return next();
})

export default router
