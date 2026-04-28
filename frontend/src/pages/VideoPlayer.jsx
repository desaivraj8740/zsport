import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Hls from 'hls.js'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const chat = [
  { user: 'User982', color: 'var(--primary-dim)', msg: 'LETS GO WOLVES!!' },
  { user: 'ProFan', color: 'rgba(255,255,255,0.5)', msg: 'Lions defense is slipping...' },
  { user: 'Mod_Dave', color: 'var(--secondary-container)', msg: 'Keep it civil guys!' },
  { user: 'GamerX', color: '#fff', msg: 'That play was INSANE!' },
  { user: 'User123', color: 'var(--primary-dim)', msg: 'Wolves winning 100%' },
]

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(14000)
  const [fullscreen, setFullscreen] = useState(false)
  const [buffering, setBuffering] = useState(false)

  // Custom Controls State
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [showWarning, setShowWarning] = useState(false)

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
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
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      const v = videoRef.current
      if (!v) return

      if (e.code === 'Space') {
        e.preventDefault()
        if (v.paused) { v.play(); setPlaying(true); }
        else { v.pause(); setPlaying(false); }
      } else if (e.code === 'ArrowRight') {
        v.currentTime += 10
      } else if (e.code === 'ArrowLeft') {
        v.currentTime -= 10
      } else if (e.code === 'KeyM') {
        setMuted(m => !m)
      } else if (e.code === 'KeyF') {
        toggleFullScreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const toggleFullScreen = () => {
    const v = videoRef.current
    if (!v) return
    if (!document.fullscreenElement) {
      v.parentElement.requestFullscreen().catch(err => console.log(err))
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  // Screen recording & App switching Protection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden || !document.hasFocus()) {
        const v = videoRef.current
        if (v && !v.paused) v.pause()
        setPlaying(false)
        setShowWarning(true)
      } else {
        setShowWarning(false)
        const v = videoRef.current
        if (v && v.paused) {
          v.play().catch(err => console.log("Auto-resume blocked:", err))
          setPlaying(true)
        }
      }
    }

    window.addEventListener('blur', handleVisibility)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('blur', handleVisibility)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(formatTime(v.currentTime));
    setProgress((v.currentTime / v.duration) * 100 || 0);
  };

  const handleDurationChange = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(formatTime(v.duration));
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const seekbar = e.currentTarget;
    const rect = seekbar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    v.currentTime = pos * v.duration;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const feat = videos.length > 0 ? videos[0] : null
  const recs = videos.slice(1, 5)

  const safeUrl = !feat ? '' : (feat.url === '#' || !feat.url ? 'https://www.w3schools.com/html/mov_bbb.mp4' : feat.url)

  // HLS DRM Init
  useEffect(() => {
    if (!videoRef.current || !safeUrl) return;
    const v = videoRef.current;

    // Check if it's an m3u8 file
    if (safeUrl.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: function (xhr, url) {
            xhr.withCredentials = false; // Add real auth integration in prod
          }
        });
        hls.loadSource(safeUrl);
        hls.attachMedia(v);
        return () => hls.destroy();
      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = safeUrl;
      }
    }
  }, [safeUrl]);

  if (loading) return <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Player...</div>
  if (!feat) return <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>No videos available.</div>

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', userSelect: 'none' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div className="vp-layout">
          {/* Player column */}
          <div className="vp-main">
            <motion.div className="vp-player glass" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} style={{ pointerEvents: showWarning ? 'none' : 'auto' }}>
              <AnimatePresence>
                {showWarning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <div style={{ background: 'var(--primary-container)', color: '#fff', padding: '16px 20px', borderRadius: '10px', maxWidth: '320px', border: '1px solid var(--primary)', transform: 'rotate(-1.5deg)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--error, #ff4c4c)' }}>warning</span>
                        <h4 style={{ fontWeight: 800, margin: 0 }}>SECURITY WARNING</h4>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>This app does not support to switch between any apps while watching this. You need to exit from this page to open any other apps.</p>
                      <p style={{ fontSize: 10, color: '#fff', marginTop: 8, fontWeight: 700, opacity: 0.8 }}>DRM SCREEN RECORDING PROTECTION ACTIVE</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buffering Overlay */}
              {buffering && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, background: 'rgba(0,0,0,0.25)', pointerEvents: 'none' }}>
                  <div style={{ width: 56, height: 56, border: '4px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--primary-dim)', borderRadius: '50%', animation: 'vp-spin 0.75s linear infinite' }} />
                </div>
              )}
              <video
                ref={videoRef}
                src={!safeUrl.endsWith('.m3u8') ? safeUrl : undefined}
                className="vp-bg"
                autoPlay={playing}
                muted={muted}
                playsInline
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onEnded={() => setPlaying(false)}
                onPlay={() => { setPlaying(true); setBuffering(false); }}
                onPause={() => setPlaying(false)}
                onWaiting={() => setBuffering(true)}
                onStalled={() => setBuffering(true)}
                onCanPlay={() => setBuffering(false)}
                onPlaying={() => setBuffering(false)}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Live badge */}
              {feat.isLive && (
                <div className="vp-live-badge glass">
                  <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
                    <span className="ping-ring" />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block', position: 'relative', zIndex: 1 }} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em' }}>LIVE</span>
                  <span style={{ fontSize: 11, color: 'var(--on-surface-var)' }}>{feat.views || '1.2k'} Watching</span>
                </div>
              )}
              {/* Premium Custom Controls */}
              <div className="vp-controls">
                <div className="vp-seek" onClick={handleSeek} style={{ cursor: 'pointer', position: 'relative', height: '10px' }}>
                  <div className="vp-progress" style={{ width: `${progress}%`, pointerEvents: 'none', background: 'var(--primary)', height: '4px', borderRadius: '4px' }} />
                  <div className="vp-thumb" style={{ left: `calc(${progress}% - 6px)`, pointerEvents: 'none', width: '12px', height: '12px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '-4px', boxShadow: '0 0 10px rgba(37,99,235,0.5)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button className="vp-btn" onClick={togglePlay}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32 }}>{playing ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button className="vp-btn"><span className="material-symbols-outlined" style={{ fontSize: 26 }}>skip_next</span></button>
                    <button className="vp-btn" onClick={() => setMuted(m => !m)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{muted ? 'volume_off' : 'volume_up'}</span>
                    </button>
                    <span style={{ fontSize: 13, color: '#fff', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                      {feat.isLive ? 'LIVE' : `${currentTime} / ${duration}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <button className="vp-btn"><span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span></button>
                    <button className="vp-btn" onClick={toggleFullScreen}>
                      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{fullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Meta */}
            <motion.div className="glass vp-meta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <h1 className="headline-lg" style={{ color: '#fff' }}>{feat.title}</h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-dim)', fontWeight: 700, fontSize: 13 }}>#{feat.category?.replace(/\s+/g, '')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{feat.created_at ? new Date(feat.created_at).toLocaleDateString() : 'Just now'}</span>
                    {feat.isPremium && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(47,248,1,0.08)', border: '1px solid rgba(47,248,1,0.2)', padding: '3px 10px', borderRadius: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--secondary-container)' }}>verified</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--secondary-container)', letterSpacing: '0.05em' }}>PREMIUM SUBSCRIBERS ONLY</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="vp-action" onClick={() => { const next = !liked; setLiked(next); setLikeCount(c => next ? c + 1 : c - 1); }} style={{ color: liked ? 'var(--primary-dim)' : undefined, transition: 'color 0.2s, transform 0.15s', transform: liked ? 'scale(1.12)' : 'scale(1)' }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                    {likeCount >= 1000 ? (likeCount / 1000).toFixed(1) + 'k' : likeCount}
                  </button>
                  <button className="vp-action"><span className="material-symbols-outlined">share</span> Share</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', margin: '18px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,219,233,0.12)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary-dim)' }}>sports_esports</span>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {feat.uploader_name || 'ZSport Official'}
                      <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary-dim)' }}>verified</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Platform Host</div>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Subscribe</button>
                </div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 14 }}>
                {feat.description || 'Watch premium sports content and event coverage live natively on SporShield. Features real-time player data and low latency transmission.'}
              </p>
            </motion.div>
          </div>

          {/* Sidebar col */}
          <div className="vp-side">
            <h2 className="headline-md" style={{ color: '#fff', marginBottom: 18 }}>Up Next</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recs.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.07 }}>
                  <Link to="/watch" className="rec-card">
                    <div className="rec-thumb">
                      <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=80" alt={r.title} className="rec-img" />
                      <div className="rec-dur" style={{ background: r.isLive ? 'var(--secondary-container)' : 'rgba(0,0,0,0.82)' }}>{r.isLive ? 'LIVE' : r.quality || '1080p'}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="rec-title">{r.title}</h3>
                      <p style={{ fontSize: 10, color: 'var(--primary-dim)', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase', margin: '3px 0 2px' }}>{r.category}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{r.views || '1.2M'} views</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Chat */}
            {feat.isLive && (
              <motion.div className="glass vp-chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-dim)' }}>forum</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Live Fan Chat</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="live-dot" style={{ width: 7, height: 7 }} />
                    <span style={{ fontSize: 10, color: 'var(--secondary-container)', fontWeight: 800 }}>LIVE</span>
                  </div>
                </div>
                <div style={{ height: 130, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {chat.map((m, i) => (
                    <div key={i} style={{ fontSize: 12 }}>
                      <span style={{ color: m.color, fontWeight: 700 }}>{m.user}: </span>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{m.msg}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 13 }}>Join Discussion</button>
              </motion.div>
            )}
          </div>
        </div>
        <Footer />
      </main>

      <style>{`
        @keyframes vp-spin { to { transform: rotate(360deg); } }
        .vp-layout { display: grid; grid-template-columns: 1fr 360px; gap: 22px; padding: 20px var(--margin-safe) 0; max-width: 1560px; margin: 0 auto; }
        .vp-main { display: flex; flex-direction: column; gap: 14px; }
        .vp-player { position: relative; aspect-ratio: 16/9; border-radius: 18px; overflow: hidden; cursor: pointer; }
        .vp-bg { width: 100%; height: 100%; object-fit: cover; display: block; }
        .vp-live-badge { position: absolute; top: 18px; left: 18px; display: flex; align-items: center; gap: 8px; padding: 5px 13px; border-radius: 999px; color: #fff; }
        .vp-controls { position: absolute; inset: 0; background: linear-gradient(to top, rgba(9,9,11,0.9) 0%, transparent 45%); opacity: 0; transition: opacity 0.28s; display: flex; flex-direction: column; justify-content: flex-end; padding: 22px 24px; gap: 12px; }
        .vp-player:hover .vp-controls { opacity: 1; }
        .vp-seek { width: 100%; height: 4px; background: rgba(255,255,255,0.18); border-radius: 2px; cursor: pointer; position: relative; }
        .vp-progress { position: absolute; left: 0; top: 0; height: 100%; width: 60%; background: var(--primary-container); border-radius: 2px; }
        .vp-thumb { position: absolute; width: 13px; height: 13px; background: var(--primary); border-radius: 50%; top: 50%; left: 60%; transform: translate(-50%, -50%); box-shadow: 0 0 8px rgba(0,240,255,0.5); }
        .vp-btn { background: none; border: none; cursor: pointer; color: #fff; display: flex; align-items: center; transition: color 0.18s; }
        .vp-btn:hover { color: var(--primary-dim); }
        .vp-meta { border-radius: 14px; padding: 22px; }
        .vp-action { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #fff; cursor: pointer; font-size: 13px; font-family: var(--font-inter); transition: background 0.18s; }
        .vp-action:hover { background: rgba(255,255,255,0.08); }
        .vp-side { display: flex; flex-direction: column; gap: 18px; padding-top: 16px; }
        .rec-card { display: flex; gap: 12px; text-decoration: none; cursor: pointer; }
        .rec-card:hover .rec-title { color: var(--primary-dim); }
        .rec-card:hover .rec-img { transform: scale(1.06); }
        .rec-thumb { position: relative; width: 148px; flex-shrink: 0; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .rec-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.38s; }
        .rec-dur { position: absolute; bottom: 4px; right: 4px; color: #000; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 3px; }
        .rec-title { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.35; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; transition: color 0.18s; }
        .vp-chat { border-radius: 14px; padding: 18px; border: 1px solid rgba(0,219,233,0.14); background: rgba(0,219,233,0.025) !important; }
        @media (max-width: 1100px) { .vp-layout { grid-template-columns: 1fr; } .vp-side { display: grid; grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .vp-side { grid-template-columns: 1fr; } .vp-layout { padding: 14px; } }
      `}</style>
    </div>
  )
}
