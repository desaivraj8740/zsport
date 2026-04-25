import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout, { getUser } from './AdminLayout'

export default function AdminContent() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editThumbPrev, setEditThumbPrev] = useState(null)
  const editThumbRef = useRef()
  
  const user = getUser()

  const fetchContent = () => {
    setLoading(true)
    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        if (d.success) setVideos(d.data || [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this content?")) return;
    try {
      const r = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      const d = await r.json()
      if (d.success) fetchContent();
      else alert("Error deleting video.");
    } catch(err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData()
    fd.append('title', editForm.title)
    fd.append('category', editForm.category)
    fd.append('quality', editForm.quality)
    fd.append('isLive', editForm.isLive)
    fd.append('isPremium', editForm.isPremium)
    
    if (editThumbRef.current?.files?.[0]) {
      fd.append('thumbnail', editThumbRef.current.files[0])
    }

    try {
      const r = await fetch(`/api/videos/${editing.id}`, {
        method: 'PUT',
        body: fd
      })
      const d = await r.json()
      if (d.success) {
        setEditing(null)
        setEditThumbPrev(null)
        fetchContent()
      } else alert("Error updating content.")
    } catch(err) {
      console.error(err)
    }
  }

  const handleThumb = (e) => {
    const file = e.target.files[0]
    if (file) setEditThumbPrev(URL.createObjectURL(file))
  }

  const visibleVideos = user?.role === 'admin' ? videos : videos.filter(v => v.uploader_name === user?.name)

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 className="headline-md" style={{ color: '#fff', marginBottom: 6 }}>Manage Content</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Review, update, and manage your uploaded sports broadcasts</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Thumbnail', 'Title', 'Category', 'Status', 'Uploader', 'Quality', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, color: '#fff' }}>Loading content...</td></tr>
                ) : visibleVideos.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, color: '#fff' }}>No content found.</td></tr>
                ) : (
                  visibleVideos.map((v, i) => (
                    <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <img src={v.thumbnail || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&q=80'} 
                             alt="thumb" 
                             style={{ width: 66, height: 38, objectFit: 'cover', borderRadius: 6, display: 'block', border: '1px solid rgba(255,255,255,0.1)' }} />
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, marginBottom: 3 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{v.created_at ? new Date(v.created_at).toLocaleDateString() : 'Just now'}</div>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{v.category}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ background: v.is_live ? 'rgba(255,107,107,0.1)' : 'rgba(0,219,233,0.1)', color: v.is_live ? '#ff6b6b' : 'var(--primary-dim)', padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {v.is_live ? 'LIVE' : 'VOD'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#fff', fontSize: 13 }}>{v.uploader_name || 'System'}</td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{v.quality}</td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: '#fff', transition: 'all 0.2s' }} title="Edit" onClick={() => {
                            setEditing(v)
                            setEditThumbPrev(v.thumbnail || null)
                            setEditForm({ title: v.title, category: v.category, quality: (v.quality || '4K HDR'), isLive: !!v.is_live, isPremium: !!v.is_premium })
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          </button>
                          <button style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: '#ff6b6b', transition: 'all 0.2s' }} title="Delete" onClick={() => handleDelete(v.id)}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editing && (
            <div className="modal-overlay" onClick={() => setEditing(null)}>
              <motion.div className="glass modal-card" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h2 className="headline-md" style={{ color: '#fff', fontSize: 20 }}>Edit Content</h2>
                  <button className="icon-btn" onClick={() => setEditing(null)}><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Thumbnail Upload</label>
                    <div onClick={() => editThumbRef.current.click()} style={{ width: '100%', height: 90, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: editThumbPrev ? `url(${editThumbPrev}) center/cover` : 'rgba(255,255,255,0.02)', color: editThumbPrev ? 'transparent' : 'inherit' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'rgba(255,255,255,0.4)', textShadow: editThumbPrev ? '0 0 10px rgba(0,0,0,0.8)' : 'none' }}>add_photo_alternate</span>
                    </div>
                    <input type="file" ref={editThumbRef} accept="image/*" style={{ display: 'none' }} onChange={handleThumb} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Title</label>
                    <input type="text" className="form-input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Category</label>
                    <select className="form-input" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                      {['Live Sports', 'Documentary', 'Highlights', 'Analysis', 'Training', 'Esports', 'Cricket', 'Football'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Quality</label>
                    <select className="form-input" value={editForm.quality} onChange={e => setEditForm(f => ({ ...f, quality: e.target.value }))}>
                      {['4K HDR', '1080p', '720p', '480p'].map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                    <label style={{ color: '#fff', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editForm.isLive} onChange={e => setEditForm(f => ({ ...f, isLive: e.target.checked }))} />
                      Live Event
                    </label>
                    <label style={{ color: '#fff', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editForm.isPremium} onChange={e => setEditForm(f => ({ ...f, isPremium: e.target.checked }))} />
                      Premium Only
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
                    <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </div>
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
