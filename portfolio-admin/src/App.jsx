import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { getToken } from './auth'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ResourcePage from './pages/ResourcePage'

const resources = [
  { path: 'users', label: 'Users', endpoint: 'users' },
  { path: 'experiences', label: 'Experiences', endpoint: 'experiences' },
  { path: 'educations', label: 'Educations', endpoint: 'educations' },
  { path: 'skill-categories', label: 'Skill Categories', endpoint: 'skill-categories' },
  { path: 'skills', label: 'Skills', endpoint: 'skills' },
  { path: 'user-skills', label: 'User Skills', endpoint: 'user-skills' },
  { path: 'projects', label: 'Projects', endpoint: 'projects' },
  { path: 'project-skills', label: 'Project Skills', endpoint: 'project-skills' },
  { path: 'blog-posts', label: 'Blog Posts', endpoint: 'blog-posts' },
  { path: 'tags', label: 'Tags', endpoint: 'tags' },
  { path: 'post-tags', label: 'Post Tags', endpoint: 'post-tags' },
  { path: 'certifications', label: 'Certifications', endpoint: 'certifications' },
  { path: 'contact-messages', label: 'Contact Messages', endpoint: 'contact-messages' },
]

function ProtectedRoute() {
  if (!getToken()) return <Navigate to="/login" replace />
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {resources.map((r) => (
            <Route key={r.path} path={r.path} element={<ResourcePage config={r} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
