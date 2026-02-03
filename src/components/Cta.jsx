import React from 'react'
import ScrollReveal from './ScrollReveal'
import { useModal } from './Modal'

export default function Cta() {
  const { openModal } = useModal()

  return (
    <section id="cta" className="section" style={{
      backgroundImage:'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=70)',
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(0,229,255,.07), rgba(255,107,53,.05)), linear-gradient(180deg, var(--bg), rgba(8,8,10,.88) 30%, rgba(8,8,10,.88) 70%, var(--bg))', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScrollReveal><span className="label">Ready?</span></ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="section-h2">Stop losing customers.<br/><span className="hi-white">Start getting them.</span></h2>
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <p style={{ color:'var(--text-dim)', maxWidth:460, textAlign:'center', marginTop:16, fontSize:'.97rem', lineHeight:1.72 }}>
            Join hundreds of small businesses worldwide who now get leads every single day.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.24}>
          <div style={{ marginTop:38, display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <button className="btn btn-cyan btn-cyan-lg" onClick={() => openModal('contact')}>
              Get Your Free Website →
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.36}>
          <div style={{ marginTop:36, display:'flex', gap:28, flexWrap:'wrap', justifyContent:'center' }}>
            {['No credit card needed','Live in 48 hours','100% money back if unhappy'].map((t, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:'.95rem' }}>✅</span>
                <p style={{ fontSize:'.78rem', color:'var(--text-dim)' }}>{t}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
