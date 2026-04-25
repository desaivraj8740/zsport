import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

export default function AdminInsights() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <h1 className="headline-lg" style={{ color: '#fff', marginBottom: 6 }}>Insights & Analytics</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Detailed performance metrics for your content.</p>

        <div className="glass" style={{ padding: 40, borderRadius: 16, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--primary-dim)', opacity: 0.5, marginBottom: 16 }}>query_stats</span>
          <h2 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>Analytics Processing</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>We are currently aggregating your viewership data for this week.</p>
          <button className="btn-ghost" style={{ padding: '12px 24px' }}>
             Download Previous Report
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
