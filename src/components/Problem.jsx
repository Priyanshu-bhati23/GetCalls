import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const cards = [
  { emoji:'😳', title:'Too complicated', desc:'Visitors get confused and leave before they even find your number. They never come back.' },
  { emoji:'💤', title:'No action buttons', desc:'No easy way to call, WhatsApp, or send a message. So they just… disappear.' },
  { emoji:'📉', title:'Zero customers', desc:'A beautiful site that brings zero leads is just a pretty photo album. It doesn\'t pay the bills.' },
]

export default function Problem() {
  return (
    <section id="problem" className="section" style={{
      backgroundImage:'url(https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=70)',
      backgroundSize:'cover', backgroundPosition:'center',
      backgroundAttachment:'fixed'
    }}>
      {/* dark overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, var(--bg), rgba(8,8,10,.88) 40%, rgba(8,8,10,.88) 60%, var(--bg))', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScrollReveal><span className="label">The Problem</span></ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="section-h2">Most websites <span className="dim">are a waste of money.</span></h2>
        </ScrollReveal>

        <ScrollReveal delay={0.14}>
          <p className="section-sub">You paid for a website. But nobody calls. Nobody messages. Nobody buys. Sound familiar?</p>
        </ScrollReveal>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:14, marginTop:54, width:'100%', maxWidth:780 }}>
          {cards.map((c, i) => (
            <ScrollReveal key={i} delay={0.1 + i*0.13}>
              <motion.div className="glass" style={{
                border:'1px solid rgba(255,107,53,.18)', padding:'30px 24px',
                transition:'transform .3s, border-color .3s'
              }}
                whileHover={{ y: -5 }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,107,53,.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,107,53,.18)'}
              >
                <span style={{ fontSize:'1.9rem', display:'block', marginBottom:14 }}>{c.emoji}</span>
                <h4 style={{ color:'#fff', fontSize:'.94rem', fontWeight:600, marginBottom:8 }}>{c.title}</h4>
                <p style={{ color:'var(--text-dim)', fontSize:'.82rem', lineHeight:1.65 }}>{c.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
