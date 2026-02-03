import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { useModal } from './Modal'

const plans = [
  {
    tier:'Starter', plan:'Starter',
    onetime: 2000, monthly: 1200,
    note_once:'Perfect to start',
    note_mo:'Cancel anytime',
    features:['5-page website','WhatsApp button','Click-to-call','Mobile-first design','Ready in 48 hours'],
    popular:false
  },
  {
    tier:'Pro', plan:'Pro',
    onetime: 8000, monthly: 4800,
    note_once:'Best for coaches & freelancers',
    note_mo:'Best for coaches & freelancers',
    features:['10-page website','WhatsApp + Call buttons','Smart contact forms','SEO setup included','1 month free support'],
    popular:true
  },
  {
    tier:'Business', plan:'Business',
    onetime:10000, monthly: 6000,
    note_once:'Full package for serious growth',
    note_mo:'Full package for serious growth',
    features:['15+ pages + blog','Everything in Pro','Google Ads landing page','3 months support','Monthly performance review'],
    popular:false
  },
]

function PriceBlock({ value, unit, note }) {
  return (
    <div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'2.7rem', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1 }}>
        ₹{value.toLocaleString()} <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'.88rem', color:'var(--text-dim)', fontWeight:400, letterSpacing:0 }}>{unit}</span>
      </div>
      <p style={{ fontSize:'.76rem', color:'var(--text-dim)', marginTop:6, marginBottom:22 }}>{note}</p>
    </div>
  )
}

export default function Pricing() {
  const [monthly, setMonthly] = useState(false)
  const { openModal } = useModal()

  return (
    <section id="pricing" className="section" style={{
      backgroundImage:'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&q=70)',
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, var(--bg), rgba(8,8,10,.9) 30%, rgba(8,8,10,.9) 70%, var(--bg))', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScrollReveal><span className="label">Pricing</span></ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="section-h2">Simple pricing.<br/><span className="hi-lime">No hidden fees.</span></h2>
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <p className="section-sub">Pick a plan. Get your website. Start earning. No surprise charges.</p>
        </ScrollReveal>

        {/* Toggle */}
        <ScrollReveal delay={0.2}>
          <div style={{ marginTop:28, display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:'.84rem', color: monthly ? 'var(--text-dim)' : '#fff', fontWeight: monthly ? 500 : 600, transition:'color .25s' }}>One-time</span>
            <div onClick={() => setMonthly(!monthly)} style={{
              width:54, height:29, borderRadius:50,
              background:'rgba(184,255,0,.15)', border:'1px solid rgba(184,255,0,.3)',
              position:'relative', cursor:'pointer'
            }}>
              <motion.div animate={{ left: monthly ? 28 : 2 }} style={{
                position:'absolute', top:2,
                width:23, height:23, borderRadius:'50%',
                background:'var(--accent3)', boxShadow:'0 2px 8px rgba(184,255,0,.3)'
              }} transition={{ duration:.3, ease:[.22,1,.36,1] }}/>
            </div>
            <span style={{ fontSize:'.84rem', color: monthly ? '#fff' : 'var(--text-dim)', fontWeight: monthly ? 600 : 500, transition:'color .25s' }}>Monthly</span>
            <span style={{
              background:'rgba(184,255,0,.12)', border:'1px solid rgba(184,255,0,.28)',
              color:'var(--accent3)', fontSize:'.68rem', fontWeight:700,
              padding:'3px 11px', borderRadius:50, textTransform:'uppercase', letterSpacing:'.7px'
            }}>Save 40%</span>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:18, justifyContent:'center', marginTop:44, maxWidth:920, width:'100%' }}>
          {plans.map((p, i) => (
            <ScrollReveal key={i} delay={0.14 + i*0.12} style={{ flex:'1 1 240px', maxWidth:290 }}>
              <motion.div className="glass" style={{
                border: p.popular ? '1px solid rgba(0,229,255,.32)' : '1px solid rgba(255,255,255,.07)',
                boxShadow: p.popular ? '0 0 44px rgba(0,229,255,.09)' : 'none',
                padding:'36px 26px 32px', position:'relative', overflow:'hidden',
                transition:'transform .3s, box-shadow .3s'
              }}
                whileHover={{ y: -6 }}
                onMouseEnter={e => p.popular && (e.currentTarget.style.boxShadow='0 0 56px rgba(0,229,255,.18)')}
                onMouseLeave={e => p.popular && (e.currentTarget.style.boxShadow='0 0 44px rgba(0,229,255,.09)')}
              >
                {p.popular && <div style={{
                  position:'absolute', top:18, right:-30,
                  background:'var(--accent)', color:'#0a0a0a',
                  fontSize:'.62rem', fontWeight:800, padding:'5px 44px',
                  transform:'rotate(45deg)', textTransform:'uppercase', letterSpacing:'1.2px'
                }}>Popular</div>}

                <div style={{ color:'var(--text-dim)', fontSize:'.75rem', textTransform:'uppercase', letterSpacing:'1.8px', fontWeight:600, marginBottom:14 }}>{p.tier}</div>

                <AnimatePresence mode="wait">
                  {monthly
                    ? <motion.div key="mo" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
                        <PriceBlock value={p.monthly} unit="/ month" note={p.note_mo}/>
                      </motion.div>
                    : <motion.div key="ot" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
                        <PriceBlock value={p.onetime} unit="/ one-time" note={p.note_once}/>
                      </motion.div>
                  }
                </AnimatePresence>

                <ul style={{ listStyle:'none', marginBottom:28 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ fontSize:'.82rem', color:'var(--text-dim)', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ color:'var(--accent3)', fontSize:'.9rem' }}>✓</span>{f}
                    </li>
                  ))}
                </ul>

                {/* Two action buttons */}
                <div style={{ display:'flex', gap:8, flexDirection:'column' }}>
                  <button
                    onClick={() => openModal('stripe', { plan: p.plan, amount: monthly ? p.monthly : p.onetime, billing: monthly ? 'monthly' : 'once' })}
                    style={{
                      width:'100%', padding:'12px', borderRadius:50, border:'none', cursor:'pointer',
                      background: p.popular ? 'var(--accent)' : 'rgba(0,229,255,.12)',
                      color: p.popular ? '#0a0a0a' : 'var(--accent)',
                      fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'.84rem',
                      transition:'transform .2s, box-shadow .2s'
                    }}
                    onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 6px 22px var(--accent-glow)' }}
                    onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none' }}
                  >Pay Now — ₹{(monthly ? p.monthly : p.onetime).toLocaleString()}</button>

                  <button
                    onClick={() => openModal('contact', { plan: p.plan })}
                    style={{
                      width:'100%', padding:'10px', borderRadius:50,
                      background:'transparent', border:'1px solid rgba(255,255,255,.18)', color:'#fff',
                      fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:'.8rem', cursor:'pointer',
                      transition:'border-color .2s, background .2s'
                    }}
                    onMouseEnter={e => { e.target.style.borderColor='rgba(255,255,255,.42)'; e.target.style.background='rgba(255,255,255,.06)' }}
                    onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,.18)'; e.target.style.background='transparent' }}
                  >Contact Us First</button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
