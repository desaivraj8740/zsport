import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div style={{ padding: '40px var(--margin-safe) 80px', maxWidth: 800, margin: '0 auto' }}>
          <motion.h1 className="headline-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', marginBottom: 20 }}>
            Contact Support
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Whether you are reporting a piracy attempt or experiencing stream issues, our 24/7 support shield is here to assist.
          </motion.p>
          
          <motion.form className="glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: 32, borderRadius: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="form-label">Topic</label>
                <select className="form-input">
                  <option>General Inquiry</option>
                  <option>Report Piracy</option>
                  <option>Technical Support</option>
                  <option>Billing</option>
                </select>
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-input" rows="5" placeholder="How can we help?" style={{ resize: 'vertical' }}></textarea>
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 24, justifyContent: 'center' }}>
              <span className="material-symbols-outlined">send</span> Send Message
            </button>
          </motion.form>
        </div>
        <Footer />
      </main>
    </div>
  )
}
