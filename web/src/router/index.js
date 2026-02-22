import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Skills from '../pages/Skills.vue'
import Projects from '../pages/Projects.vue'
import Blog from '../pages/Blog.vue'
import Contact from '../pages/Contact.vue'
import Status from '../pages/Status.vue'
import BlogPost from '../pages/BlogPost.vue'
import Login from '../pages/Login.vue'
import AdminLayout from '../components/AdminLayout.vue'
import AdminOverview from '../pages/admin/AdminOverview.vue'
import AdminCategories from '../pages/admin/AdminCategories.vue'
import AdminSkills from '../pages/admin/AdminSkills.vue'
import NotFound from '../pages/NotFound.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'about', name: 'About', component: About },
      { path: 'skills', name: 'Skills', component: Skills },
      { path: 'projects', name: 'Projects', component: Projects },
      { path: 'blog', name: 'Blog', component: Blog },
      { path: 'blog/:slug', name: 'BlogPost', component: BlogPost },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'status', name: 'Status', component: Status },
      { path: 'login', name: 'Login', component: Login },
      {
        path: 'admin',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
          { path: '', name: 'Admin', component: AdminOverview },
          { path: 'categories', name: 'AdminCategories', component: AdminCategories },
          { path: 'skills', name: 'AdminSkills', component: AdminSkills },
        ],
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuth()
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && auth.isLoggedIn()) {
    return { name: 'Admin' }
  }
})

export default router
