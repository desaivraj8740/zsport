import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const aboutCards = [
  { icon: 'shield', title: 'Military-grade DRM', desc: 'AES-128 HLS encryption with rotating keys per upload. Every stream is individually secured.', accent: false },
  { icon: 'bolt', title: '10x Faster CDN', desc: 'Edge-optimised delivery with 0.1s latency globally. Never buffer on premium events again.', accent: true },
  { icon: 'token', title: 'Fan Economy', desc: 'Unlock governance rights and exclusive rewards within your favourite sports organisations.', accent: false },
]

export default function About() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div style={{ padding: '40px var(--margin-safe) 80px', maxWidth: 1100, margin: '0 auto' }}>

          {/* Hero text */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(37,99,235,0.4)', padding: '4px 14px', borderRadius: 999, marginBottom: 20 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>About ZSport</span>
            </div>
            <h1 className="headline-xl" style={{ color: '#fff', marginBottom: 16, maxWidth: 700 }}>
              Forging the Future of Sports Entertainment
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.75, maxWidth: 640 }}>
              The premier OTT platform dedicated to redefining how fans connect with their sports — with ultra-low latency streams, enterprise-grade anti-piracy, and a digital asset economy built for fans.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {/* Large mission card - 2 col wide */}
            <motion.div className="bento bento-accent" style={{ gridColumn: 'span 2', padding: 36 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--primary-dim)', marginBottom: 14, display: 'block' }}>stars</span>
              <h2 style={{ fontFamily: 'var(--font-lexend)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Our Mission</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
                To eliminate unauthorized streams and deliver a pure, high-fidelity sporting experience that rewards official content creators and respects the passionate global fan base. Born out of necessity, ZSport's custom infrastructure protects both creators and viewers.
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[['4K+', 'Live Streams'], ['0.1s', 'Latency'], ['98.4%', 'Uptime']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--font-lexend)', fontSize: 28, fontWeight: 900, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tall stat card */}
            <motion.div className="bento" style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#ffb800', marginBottom: 12, display: 'block' }}>emoji_events</span>
              <div>
                <div style={{ fontFamily: 'var(--font-lexend)', fontSize: 56, fontWeight: 900, background: 'linear-gradient(135deg, #fff 40%, rgba(0,219,233,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, letterSpacing: -2 }}>2M+</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 6, fontWeight: 700 }}>Active fans on the platform</div>
              </div>
              <div style={{ background: 'rgba(47,248,1,0.1)', border: '1px solid rgba(47,248,1,0.2)', color: 'var(--secondary-container)', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, alignSelf: 'flex-start' }}>GROWING FAST</div>
            </motion.div>
          </div>

          {/* 3 feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {aboutCards.map((c, i) => (
              <motion.div key={c.title} className={`bento${c.accent ? ' bento-accent' : ''}`} style={{ padding: 28 }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-dim)', fontSize: 24 }}>{c.icon}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-lexend)', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{c.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Responsive styles */}
          <style>{`
            @media (max-width: 768px) {
              div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
              div[style*="span 2"] { grid-column: span 1 !important; }
            }
          `}</style>
        </div>
        <Footer />
      </main>
    </div>
  )
}
