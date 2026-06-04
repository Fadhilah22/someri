import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

import MainLayout from '../pages/MainLayout.vue'
import DocumentPage from '../pages/DocumentPage.vue'
import SummaryPage from '../pages/SummaryPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },

  {
    path: '/login',
    component: LoginPage,
  },

  {
    path: '/register',
    component: RegisterPage,
  },

  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },

    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
      },

      {
        path: 'documents',
        component: DocumentPage,
      },

      {
        path: 'summaries',
        component: SummaryPage,
      },

      // future pages
      // {
      //   path: 'courses',
      //   component: CoursesPage,
      // },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router
