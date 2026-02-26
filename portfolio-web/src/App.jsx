import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Loading from './components/Loading'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Experience = lazy(() => import('./pages/Experience'))
const Education = lazy(() => import('./pages/Education'))
const Skills = lazy(() => import('./pages/Skills'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const Certifications = lazy(() => import('./pages/Certifications'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<About />} />
          <Route path="pengalaman" element={<Experience />} />
          <Route path="pendidikan" element={<Education />} />
          <Route path="skills" element={<Skills />} />
          <Route path="proyek" element={<Projects />} />
          <Route path="proyek/:id" element={<ProjectDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<PostDetail />} />
          <Route path="sertifikasi" element={<Certifications />} />
          <Route path="kontak" element={<Contact />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
