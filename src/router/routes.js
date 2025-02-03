const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true, withResult: false } },
      { path: '/wheel', component: () => import('src/pages/WheelPage.vue'), meta: { requiresAuth: true, withResult: false } },
      { path: '/teams', component: () => import('pages/TeamsPage.vue'), meta: { requiresAuth: true, withResult: false } },
      { path: '/general-questions', component: () => import('pages/QuestionPage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/penalties', component: () => import('pages/PenaltyPage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/under-pressure', component: () => import('pages/PressurePage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/talents', component: () => import('pages/TalentPage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/categories', component: () => import('pages/CategoryPage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/section', component: () => import('pages/SectionPage.vue'), meta: { requiresAuth: true, withResult: true } },
      { path: '/result', component: () => import('pages/ResultPage.vue'), meta: { requiresAuth: true, withResult: false } },
    ]
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
