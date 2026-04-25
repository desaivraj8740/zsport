import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div style={{ padding: '40px var(--margin-safe) 80px', maxWidth: 1000, margin: '0 auto' }}>
          <motion.h1 className="headline-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', marginBottom: 20 }}>
            Forging the Future of Sports Entertainment
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 20 }}>SportShield is the premier OTT platform dedicated to redefining how fans connect with their favorite sports. Offering ultra-low latency streams across global leagues ranging from the Premier League to the hottest Esports tournaments, we secure the viewing experience with integrated anti-piracy solutions.</p>
            <p style={{ marginBottom: 20 }}>Born out of a necessity to provide seamless content delivery without the compromise of illegal restreaming, our custom infrastructure protects both creators and viewers. Welcome to a better way to watch.</p>
            <div className="glass glow" style={{ padding: '24px', borderRadius: 16, marginTop: 40, border: '1px solid rgba(0,219,233,0.3)' }}>
              <h2 className="headline-md" style={{ color: 'var(--primary-dim)', marginBottom: 10 }}>Our Mission</h2>
              <p>To eliminate unauthorized streams and deliver a pure, high-fidelity sporting experience that rewards official content creators and respects the passionate global fan base.</p>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  )
}
