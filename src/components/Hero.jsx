import React from 'react'
import { motion } from 'framer-motion'
import { useModal } from './Modal'

const words1 = ['Your','website','should']
const words2 = ['get','you','calls.']
const words3 = ['Not','just','look','pretty.']

function Word({ children, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'inline-block', marginRight: '0.22em' }}
    >{children}</motion.span>
  )
}

export default function Hero() {
  const { openModal } = useModal()

  return (
    <section id="hero" style={{
      position:'relative', zIndex:1,
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      paddingTop:140, paddingBottom:80, paddingLeft:24, paddingRight:24,
      textAlign:'center', overflow:'hidden'
    }}>
      {/* Background image */}
      <div style={{
        position:'absolute', inset:0, zIndex:-1,
        backgroundImage:'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80)',
        backgroundSize:'cover', backgroundPosition:'center',
        filter:'brightness(.22) saturate(1.3)'
      }}/>
      {/* gradient fade at bottom */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:'45%', zIndex:0,
        background:'linear-gradient(to top, var(--bg), transparent)'
      }}/>

      {/* Badge */}
      <motion.div
        initial={{ opacity:0, y:14, scale:.95 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.5, delay:.12, ease:[.22,1,.36,1] }}
        style={{
          position:'relative', zIndex:1,
          display:'inline-block',
          background:'rgba(0,229,255,.1)', border:'1px solid rgba(0,229,255,.28)',
          color:'var(--accent)', padding:'7px 20px', borderRadius:50,
          fontSize:'.76rem', fontWeight:600, letterSpacing:'.6px',
          marginBottom:26
        }}
      >✦ Conversion-first websites — worldwide</motion.div>

      {/* Headline */}
      <h1 style={{ position:'relative', zIndex:1, fontFamily:"'Syne',sans-serif", fontWeight:800, lineHeight:1.02, letterSpacing:'-3.5px', color:'#fff', fontSize:'clamp(2.9rem, 9vw, 6rem)', margin:0 }}>
        <span style={{ display:'block' }}>
          {words1.map((w, i) => <Word key={i} delay={0.28 + i*0.08}>{w}</Word>)}
        </span>
        <span style={{ display:'block', color:'var(--accent)' }}>
          {words2.map((w, i) => <Word key={i} delay={0.52 + i*0.08}>{w}</Word>)}
        </span>
        <span style={{ display:'block' }}>
          {words3.map((w, i) => <Word key={i} delay={0.76 + i*0.08}>{w}</Word>)}
        </span>
      </h1>

      {/* Sub */}
      <motion.p
        initial={{ opacity:0, y:18 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.7, delay:1.1, ease:[.22,1,.36,1] }}
        style={{ position:'relative', zIndex:1, color:'var(--text-dim)', maxWidth:530, margin:'28px auto 0', fontSize:'1.05rem', lineHeight:1.75 }}
      >
        We build websites that turn visitors into paying customers — through calls, WhatsApp &amp; contact forms. Simple. Fast. Done in days.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity:0, y:18 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.7, delay:1.3, ease:[.22,1,.36,1] }}
        style={{ position:'relative', zIndex:1, marginTop:38, display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}
      >
        <button className="btn btn-cyan btn-cyan-lg" onClick={() => openModal('contact')}>
          Get Your Website Free →
        </button>
        <a href="#solution" className="btn btn-ghost"
          onClick={e => { e.preventDefault(); document.querySelector('#solution')?.scrollIntoView({ behavior:'smooth' }) }}>
          See How It Works
        </a>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity:0, y:22 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.7, delay:1.52, ease:[.22,1,.36,1] }}
        style={{ position:'relative', zIndex:1, marginTop:64, display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}
      >
        {[
          { icon:'📞', text:'One-tap calling' },
          { icon:'💬', text:'WhatsApp button' },
          { icon:'📩', text:'Smart forms' },
          { icon:'🚀', text:'Live in 48 hrs' },
        ].map((c, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.55, delay:1.52 + i*0.1, ease:[.22,1,.36,1] }}
            className="glass"
            style={{ padding:'20px 22px', width:140, textAlign:'center', transition:'border-color .3s, transform .3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,229,255,.25)'; e.currentTarget.style.transform='translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.transform='translateY(0)' }}
          >
            <div style={{ fontSize:'1.7rem', marginBottom:6 }}>{c.icon}</div>
            <p style={{ fontSize:'.79rem', color:'var(--text-dim)', fontWeight:500 }}>{c.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
