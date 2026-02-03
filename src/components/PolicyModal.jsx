import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal, useModal } from './Modal'

const privacy = `
## Privacy Policy
**Last updated: February 2026**

### What We Collect
When you use GetCalls or fill out our contact form, we may collect:
- Your name, phone number, and email address
- Business type and a short description of your needs
- Payment information (processed securely through Stripe — we never store card numbers)
- Basic usage data (pages visited, time spent) via anonymous analytics

### How We Use It
- To respond to your inquiry and build your website
- To send you a one-time confirmation email
- To process payments securely
- To improve our services

### Who We Share With
We do **not** sell your data. We may share with:
- **Stripe** — for secure payment processing
- **EmailJS** — to deliver confirmation emails
- **OpenAI** — only anonymized chat data for our AI assistant

### Your Rights
You can request deletion of your personal data at any time by emailing priyanshubhati.dev@gmail.com.

### Cookies
We use minimal cookies for analytics only. No tracking cookies are set without your consent.

### Changes
We may update this policy. Changes will be posted on this page.

### Contact
If you have questions, reach out: **priyanshubhati.dev@gmail.com** or call **+91 9057278418**.
`

const terms = `
## Terms of Service
**Last updated: February 2026**

### Agreement
By using GetCalls, you agree to these terms. If you disagree, please do not use our services.

### Services
GetCalls designs and builds conversion-first websites for small businesses. Deliverables include:
- A custom website with call, WhatsApp, and contact form features
- SEO optimization and mobile-first design
- Support as outlined in your chosen plan

### Payment
- Payments are processed via Stripe and are non-refundable after work has begun.
- **100% money-back guarantee** applies only if no work has been started within 48 hours of payment.
- Monthly plans can be cancelled at any time; cancellation takes effect at the end of the billing cycle.

### Intellectual Property
The final website delivered to you is yours. During development, all drafts and templates remain GetCalls' property.

### Limitations of Liability
GetCalls is not liable for indirect damages, lost profits, or damages arising from third-party services (hosting, domain, etc.).

### Termination
We may terminate your access if you violate these terms.

### Governing Law
These terms are governed by Indian law. Disputes will be resolved in courts in India.

### Changes
We may modify these terms at any time. Continued use of our services constitutes acceptance.

### Contact
Questions? Email **priyanshubhati.dev@gmail.com**.
`

function renderMd(text) {
  // very lightweight markdown → JSX (h2, h3, bold, paragraphs)
  return text.trim().split('\n').map((line, i) => {
    if (line.startsWith('## '))  return <h2 key={i} style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.3rem', fontWeight:800, color:'#fff', marginTop: i===0?0:22, marginBottom:8, letterSpacing:'-0.8px' }}>{line.slice(3)}</h2>
    if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize:'.92rem', fontWeight:700, color:'#fff', marginTop:18, marginBottom:6 }}>{line.slice(4)}</h3>
    if (line.trim() === '')       return null
    // inline bold
    const parts = line.split(/(\*\*.*?\*\*)/)
    return (
      <p key={i} style={{ fontSize:'.82rem', color:'var(--text-dim)', lineHeight:1.7, marginBottom:8 }}>
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} style={{ color:'var(--text-mid)' }}>{p.slice(2,-2)}</strong>
            : p
        )}
      </p>
    )
  })
}

export default function PolicyModal() {
  const { ctx } = useModal()
  const [tab, setTab] = useState(ctx?.tab || 'privacy')

  useEffect(() => { if (ctx?.tab) setTab(ctx.tab) }, [ctx])

  return (
    <Modal id="policy" maxWidth={560}>
      {/* Tab bar */}
      <div style={{ display:'flex', gap:8, marginBottom:24, background:'rgba(255,255,255,.04)', borderRadius:12, padding:4 }}>
        {['privacy','terms'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'10px', border:'none', borderRadius:10, cursor:'pointer',
            background: tab===t ? 'rgba(0,229,255,.15)' : 'transparent',
            color: tab===t ? 'var(--accent)' : 'var(--text-dim)',
            fontFamily:"'DM Sans',sans-serif", fontSize:'.84rem', fontWeight:600,
            transition:'background .25s, color .25s', textTransform:'capitalize'
          }}>{t === 'privacy' ? '🔒 Privacy Policy' : '📄 Terms of Service'}</button>
        ))}
      </div>

      {/* Content with animated tab switch */}
      <div style={{ maxHeight:420, overflowY:'auto', paddingRight:8 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }}
            transition={{ duration:.28 }}
          >
            {renderMd(tab === 'privacy' ? privacy : terms)}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  )
}
