import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Education from './pages/Education'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Blog from './pages/Blog'
import PostDetail from './pages/PostDetail'
import Certifications from './pages/Certifications'
import Contact from './pages/Contact'

export default function App() {
  return (
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
  )
}
