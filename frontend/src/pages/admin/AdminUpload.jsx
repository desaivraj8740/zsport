import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import AdminLayout, { getUser } from './AdminLayout'

const categories = ['Live Sports', 'Documentary', 'Highlights', 'Analysis', 'Training', 'Esports', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Formula 1']
const qualities = ['4K HDR', '1080p', '720p', '480p']
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Arabic']

export default function AdminUpload() {
  const [form, setForm] = useState({ title: '', desc: '', category: 'Live Sports', quality: '4K HDR', language: 'English', isLive: false, isPremium: true, tags: '', rating: '' })
  const [thumbPrev, setThumbPrev] = useState(null)
  const [videoPrev, setVideoPrev] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const thumbRef = useRef()
  const videoRef = useRef()
  const user = getUser()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleThumb = (e) => {
    const file = e.target.files[0]
    if (file) setThumbPrev(URL.createObjectURL(file))
  }

  const handleVideo = (e) => {
    const file = e.target.files[0]
    if (file) setVideoPrev(file.name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('category', form.category)
    fd.append('isLive', form.isLive)
    fd.append('isPremium', form.isPremium)
    fd.append('desc', form.desc)
    fd.append('quality', form.quality)
    fd.append('language', form.language)
    fd.append('rating', form.rating)
    fd.append('tags', form.tags)
    fd.append('uploaderName', user?.name || 'SportShield Official')

    if (videoRef.current?.files?.[0]) fd.append('video', videoRef.current.files[0])
    if (thumbRef.current?.files?.[0]) fd.append('thumbnail', thumbRef.current.files[0])

    try {
      await fetch('/api/videos', { method: 'POST', body: fd })
      setUploading(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ title: '', desc: '', category: 'Live Sports', quality: '4K HDR', language: 'English', isLive: false, isPremium: true, tags: '', rating: '' })
        setThumbPrev(null); setVideoPrev(null)
      }, 4000)
    } catch(err) {
      console.error(err)
      setUploading(false)
    }
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="headline-lg" style={{ color: '#fff' }}>Upload Content</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Publish movies, highlights, documentaries, and live events.</p>
        </div>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(47,248,1,0.08)', border: '1px solid rgba(47,248,1,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary-container)', fontSize: 24 }}>check_circle</span>
            <div>
              <div style={{ color: 'var(--secondary-container)', fontWeight: 700, fontSize: 15 }}>Content Published Successfully!</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 2 }}>Your content "{form.title || 'New Upload'}" is now queued for processing.</div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="upload-grid">
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Video Upload Zone */}
              <div className="glass upl-zone" onClick={() => videoRef.current.click()}>
                <input type="file" ref={videoRef} accept="video/*" style={{ display: 'none' }} onChange={handleVideo} />
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: videoPrev ? 'var(--secondary-container)' : 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
                  {videoPrev ? 'check_circle' : 'cloud_upload'}
                </span>
                <div style={{ fontWeight: 700, color: videoPrev ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  {videoPrev ? videoPrev : 'Click to Upload Video File'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>MP4, MOV, MKV up to 50GB</div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="form-label">Thumbnail</label>
                <div className="upl-thumb-zone" onClick={() => thumbRef.current.click()} style={{ backgroundImage: thumbPrev ? `url(${thumbPrev})` : undefined }}>
                  <input type="file" ref={thumbRef} accept="image/*" style={{ display: 'none' }} onChange={handleThumb} />
                  {!thumbPrev && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, display: 'block', marginBottom: 6 }}>add_photo_alternate</span>
                      <span style={{ fontSize: 12 }}>Upload Thumbnail</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="glass" style={{ borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Live Event', sub: 'Mark as currently live streaming', key: 'isLive', icon: 'live_tv' },
                  { label: 'Premium Only', sub: 'Restrict to paid subscribers', key: 'isPremium', icon: 'star' },
                ].map(t => (
                  <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: form[t.key] ? 'var(--primary-dim)' : 'rgba(255,255,255,0.3)' }}>{t.icon}</span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{t.label}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{t.sub}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => set(t.key, !form[t.key])} className="toggle-btn" style={{ background: form[t.key] ? 'var(--primary-dim)' : 'rgba(255,255,255,0.1)' }}>
                      <div className="toggle-knob" style={{ transform: form[t.key] ? 'translateX(20px)' : 'translateX(0)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="form-label">Content Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Champions League Final 2024 Full Match" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={4} placeholder="Describe the content — teams, event details, highlights..." value={form.desc} onChange={e => set('desc', e.target.value)} style={{ resize: 'vertical', minHeight: 100 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Quality</label>
                  <select className="form-input" value={form.quality} onChange={e => set('quality', e.target.value)}>
                    {qualities.map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Language</label>
                  <select className="form-input" value={form.language} onChange={e => set('language', e.target.value)}>
                    {languages.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Age Rating</label>
                  <select className="form-input" value={form.rating} onChange={e => set('rating', e.target.value)}>
                    <option value="">Select</option>
                    {['U', 'U/A', 'A', 'PG', 'PG-13'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-input" placeholder="soccer, final, 2024, UEFA" value={form.tags} onChange={e => set('tags', e.target.value)} />
                {form.tags && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} style={{ background: 'rgba(0,219,233,0.08)', border: '1px solid rgba(0,219,233,0.18)', color: 'var(--primary-dim)', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }} disabled={uploading}>
                  {uploading
                    ? <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>hourglass_top</span> Publishing...</>
                    : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload</span> Publish Content</>
                  }
                </button>
                <button type="button" className="btn-ghost" style={{ padding: '14px 20px' }}>Save Draft</button>
              </div>

              {/* Progress bar when uploading */}
              {uploading && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    <span>Uploading & processing...</span><span>87%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: 'var(--primary-dim)', borderRadius: 3 }} initial={{ width: '0%' }} animate={{ width: '87%' }} transition={{ duration: 1.8, ease: 'easeOut' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .upload-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 24px; }
        .upl-zone { border-radius: 16px; border: 2px dashed rgba(255,255,255,0.12); padding: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; min-height: 180px; text-align: center; }
        .upl-zone:hover { border-color: rgba(0,219,233,0.35); }
        .upl-thumb-zone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; cursor: pointer; background-size: cover; background-position: center; transition: border-color 0.2s; }
        .upl-thumb-zone:hover { border-color: rgba(0,219,233,0.3); }
        .toggle-btn { width: 44px; height: 24px; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.25s; flex-shrink: 0; }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.25s; }
        @media (max-width: 760px) { .upload-grid { grid-template-columns: 1fr; } }
      `}</style>
    </AdminLayout>
  )
}
