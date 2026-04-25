import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import './index.css'

// Main site pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Streams from './pages/Streams'
import VideoPlayer from './pages/VideoPlayer'
import Alerts from './pages/Alerts'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin panel
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPiracy from './pages/admin/AdminPiracy'
import AdminUpload from './pages/admin/AdminUpload'
import AdminStreams from './pages/admin/AdminStreams'
import AdminInsights from './pages/admin/AdminInsights'
import AdminContent from './pages/admin/AdminContent'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Main site routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/streams" element={<ProtectedRoute><Streams /></ProtectedRoute>} />
          <Route path="/watch" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />

          {/* Admin panel */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/piracy" element={<AdminPiracy />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/streams" element={<AdminStreams />} />
          <Route path="/admin/insights" element={<AdminInsights />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
