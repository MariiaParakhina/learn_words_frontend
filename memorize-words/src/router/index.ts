import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/collections'
  },
  {
    path: '/words/:id',
    component: () => import('@/views/LookupWordsView.vue')
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
    path: '/add-collection',
    component: () => import('@/views/AddCollectionView.vue')
  },
  {
    path: '/add-words/:id',
    name: 'AddWords',
    component:()=> import('@/views/AddWordsToCollectionView.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [

      {
        path: 'collections',
        name: 'CollectionsPage',
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
