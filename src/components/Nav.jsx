import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModal } from './Modal'

const links = [
  { label: 'Problem',     href: '#problem' },
  { label: 'How It Works', href: '#solution' },
  { label: 'Features',    href: '#features' },
  { label: 'Pricing',     href: '#pricing' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { openModal } = useModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const smoothScroll = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setDrawerOpen(false)
  }

  return (
    <>
      <nav style={{
        position:'fixed', top:0, width:'100%', zIndex:200,
        padding: scrolled ? '12px 28px' : '20px 28px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        background: scrolled ? 'rgba(8,8,10,.82)' : 'rgba(8,8,10,.55)',
        borderBottom:'1px solid rgba(255,255,255,.06)',
        transition:'padding .35s, background .35s'
      }}>
        {/* Logo */}
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' }) }}
          style={{ textDecoration:'none', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.35rem', color:'#fff', letterSpacing:'-1.2px' }}>
          Get<span style={{ color:'var(--accent)' }}>Calls</span>
        </a>

        {/* Desktop links */}
        <ul style={{ display:'flex', gap:28, listStyle:'none', alignItems:'center', margin:0 }} className="nav-desktop">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={e => { e.preventDefault(); smoothScroll(l.href) }}
                style={{ color:'var(--text-mid)', textDecoration:'none', fontSize:'.84rem', fontWeight:500, transition:'color .2s' }}
                onMouseEnter={e => e.target.style.color='#fff'}
                onMouseLeave={e => e.target.style.color='var(--text-mid)'}
              >{l.label}</a>
            </li>
          ))}
          <li>
            <button className="btn btn-cyan" onClick={() => openModal('contact')}
              style={{ padding:'9px 22px', fontSize:'.82rem' }}>
              Start Free →
            </button>
          </li>
        </ul>

        {/* Hamburger */}
        <button onClick={() => setDrawerOpen(true)} className="nav-hamburger"
          style={{ display:'none', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:6 }}
          aria-label="Menu">
          <span style={{ display:'block', width:24, height:2, background:'#fff', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2, background:'#fff', borderRadius:2 }}/>
          <span style={{ display:'block', width:24, height:2, background:'#fff', borderRadius:2 }}/>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setDrawerOpen(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:199 }}/>
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration:.36, ease:[.22,1,.36,1] }}
              style={{
                position:'fixed', top:0, right:0, width:280, height:'100vh',
                background:'rgba(12,12,18,.96)', backdropFilter:'blur(20px)',
                zIndex:200, padding:'90px 24px 24px',
                display:'flex', flexDirection:'column', gap:6,
                borderLeft:'1px solid rgba(255,255,255,.07)'
              }}>
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); smoothScroll(l.href) }}
                  style={{ color:'var(--text-mid)', textDecoration:'none', fontSize:'1rem', fontWeight:500, padding:'12px 16px', borderRadius:12, transition:'background .2s, color .2s' }}
                  onMouseEnter={e => { e.target.style.background='rgba(255,255,255,.06)'; e.target.style.color='#fff' }}
                  onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--text-mid)' }}
                >{l.label}</a>
              ))}
              <button className="btn btn-cyan" onClick={() => { setDrawerOpen(false); openModal('contact') }}
                style={{ marginTop:12, width:'100%', padding:'14px' }}>
                Start Free →
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Responsive hide/show */}
      <style>{`
        @media (max-width:720px) { .nav-desktop { display:none !important; } .nav-hamburger { display:flex !important; } }
        @media (min-width:721px) { .nav-hamburger { display:none !important; } }
      `}</style>
    </>
  )
}
