import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/collections'
  },
  {
    path: '/learn/:id',
    component: () => import('@/views/LearnPathView.vue')
  },
  {
    path: '/practice/:id',
    component: () => import('@/views/WordsPracticeView.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/collections'
      },
      {
        path: 'collections',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'resources',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
