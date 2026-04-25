import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'

const roles = ['admin', 'director', 'streamer']

const roleColors = { admin: '#ff6b6b', director: '#00dbe9', streamer: '#2ff801', user: '#a78bfa' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', role: 'streamer' })
  const [search, setSearch] = useState('')

  const fetchUsers = () => {
    fetch('/api/users').then(r => r.json()).then(d => { if(d.success) setUsers(d.data || []) })
  }

  useEffect(() => { fetchUsers() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name || !form.username || !form.email) return
    await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    fetchUsers()
    setForm({ name: '', username: '', email: '', role: 'streamer' })
    setAdding(false)
  }

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
  }
  const removeUser = (id) => setUsers(prev => prev.filter(u => u.id !== id))

  const filtered = search ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase())) : users

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
          <div>
            <h1 className="headline-lg" style={{ color: '#fff' }}>User Management</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Manage admins, directors, producers, and streamers.</p>
          </div>
          <button className="btn-primary" onClick={() => setAdding(true)} style={{ gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
            Add User
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {roles.map(r => {
            const count = users.filter(u => u.role === r).length
            return (
              <div key={r} className="glass" style={{ padding: '12px 20px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: roleColors[r] }} />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{r}s</span>
                <span style={{ color: roleColors[r], fontWeight: 900, fontSize: 18, fontFamily: 'var(--font-lexend)' }}>{count}</span>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="form-input" style={{ paddingLeft: 40, maxWidth: 340 }} />
        </div>

        {/* Table */}
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['User', 'Role', 'Email', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${roleColors[u.role]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColors[u.role], fontWeight: 800, fontSize: 12, fontFamily: 'var(--font-lexend)', flexShrink: 0 }}>
                        {u.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ background: `${roleColors[u.role]}18`, color: roleColors[u.role], border: `1px solid ${roleColors[u.role]}33`, padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{u.email}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ background: u.status === 'active' ? 'rgba(47,248,1,0.08)' : 'rgba(120,0,0,0.18)', color: u.status === 'active' ? 'var(--secondary-container)' : '#ff6b6b', padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{u.status}</span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{u.joined}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleStatus(u.id)} title={u.status === 'active' ? 'Suspend' : 'Activate'}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: u.status === 'active' ? '#f87171' : 'var(--secondary-container)', transition: 'all 0.2s' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{u.status === 'active' ? 'block' : 'check_circle'}</span>
                      </button>
                      {u.username !== 'admin' && (
                        <button onClick={() => removeUser(u.id)} title="Remove"
                          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: '#f87171', transition: 'all 0.2s' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <AnimatePresence>
          {adding && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(false)}>
              <motion.div className="glass modal-card" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h2 className="headline-md" style={{ color: '#fff', fontSize: 20 }}>Add New User</h2>
                  <button className="icon-btn" onClick={() => setAdding(false)}><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={handleAdd}>
                  {[['Full Name', 'name', 'text', 'Jane Doe'], ['Username', 'username', 'text', 'janedoe'], ['Email', 'email', 'email', 'jane@example.com']].map(([label, key, type, ph]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-input" placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Role</label>
                    <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      <option value="admin">Admin (All Privileges)</option>
                      <option value="director">Director / Producer (Content & Insights)</option>
                      <option value="streamer">Streamer (Live Streaming Only)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span> Add User
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal-card { border-radius: 18px; padding: 28px; width: 100%; max-width: 480px; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
      `}</style>
    </AdminLayout>
  )
}
