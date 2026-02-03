import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const feats = [
  { icon:'📱', title:'Mobile-First Design',   desc:'Most customers browse on phones. Your site looks perfect on every screen size.' },
  { icon:'💬', title:'WhatsApp Button',        desc:'One tap opens WhatsApp directly. No copy-pasting numbers. Zero friction.' },
  { icon:'📞', title:'Click-to-Call',          desc:'A single tap dials your number instantly. Works on every phone, every time.' },
  { icon:'📩', title:'Smart Contact Forms',   desc:'Simple forms that collect what matters — name, number, and what they need.' },
  { icon:'⚡', title:'Super Fast Loading',    desc:'Slow websites lose customers. Ours load in under 2 seconds, even on 4G.' },
  { icon:'🔍', title:'Google-Ready (SEO)',    desc:'Built so Google can find you. Show up when people search for what you offer.' },
]

export default function Features() {
  return (
    <section id="features" className="section" style={{
      backgroundImage:'url(https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=70)',
      backgroundSize:'cover', backgroundPosition:'center top', backgroundAttachment:'fixed'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, var(--bg), rgba(8,8,10,.9) 30%, rgba(8,8,10,.9) 70%, var(--bg))', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScrollReveal><span className="label">What You Get</span></ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="section-h2">Everything you need.<br/><span className="hi-lime">Nothing extra.</span></h2>
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <p className="section-sub">Every feature is built to help you get more customers — not to impress your designer friends.</p>
        </ScrollReveal>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(230px,1fr))', gap:14, marginTop:54, width:'100%', maxWidth:870 }}>
          {feats.map((f, i) => (
            <ScrollReveal key={i} delay={0.08 + i*0.1}>
              <motion.div className="glass" style={{ padding:'30px 22px', transition:'border-color .3s' }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration:.3 }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(184,255,0,.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}
              >
                <span style={{ fontSize:'1.75rem', display:'block', marginBottom:16 }}>{f.icon}</span>
                <h4 style={{ color:'#fff', fontSize:'.93rem', fontWeight:600, marginBottom:8 }}>{f.title}</h4>
                <p style={{ color:'var(--text-dim)', fontSize:'.81rem', lineHeight:1.64 }}>{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
