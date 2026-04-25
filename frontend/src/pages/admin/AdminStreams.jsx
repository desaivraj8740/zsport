import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

export default function AdminStreams() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <h1 className="headline-lg" style={{ color: '#fff', marginBottom: 6 }}>My Livestreams</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Manage your active and upcoming broadcasts.</p>

        <div className="glass" style={{ padding: 40, borderRadius: 16, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--primary-dim)', opacity: 0.5, marginBottom: 16 }}>videocam_off</span>
          <h2 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>No active livestreams</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>You don't have any scheduled or active streams at the moment.</p>
          <button className="btn-primary" style={{ padding: '12px 24px' }}>
            <span className="material-symbols-outlined">add_circle</span> Schedule Stream
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
