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
import NotFound from '../pages/NotFound.vue'

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
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
