import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const activities = [
  { icon:'💬', bg:'rgba(37,211,102,.15)', title:'WhatsApp Message', sub:'Rahul just messaged you' },
  { icon:'📞', bg:'rgba(0,229,255,.15)',  title:'Incoming Call',    sub:'Priya wants a quote' },
  { icon:'📩', bg:'rgba(184,255,0,.15)',  title:'Form Submitted',  sub:'Anil sent his details' },
]

const steps = [
  { title:'Tell us about your business', desc:'Share what you do, who you serve, and what you need. Takes 5 minutes.' },
  { title:'We design & build it',        desc:'Our team creates a clean, fast website with call, WhatsApp & form buttons built right in.' },
  { title:'Go live. Start getting leads.', desc:'Your site is ready in 48 hours. Customers can reach you in one tap.' },
]

export default function Solution() {
  return (
    <section id="solution" className="section" style={{
      backgroundImage:'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=70)',
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, var(--bg), rgba(8,8,10,.88) 35%, rgba(8,8,10,.88) 65%, var(--bg))', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScrollReveal><span className="label">The Solution</span></ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="section-h2">Websites that <span className="hi-cyan">actually work.</span></h2>
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <p className="section-sub">We build sites designed around one goal — making it dead easy for people to reach you.</p>
        </ScrollReveal>

        {/* Mockup + Steps row */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:48, alignItems:'center', justifyContent:'center', marginTop:58, maxWidth:920, width:'100%' }}>

          {/* Mockup card */}
          <ScrollReveal delay={0.1} style={{ flex:'1 1 280px', maxWidth:420 }}>
            <div className="glass" style={{ border:'1px solid rgba(0,229,255,.15)', borderRadius:22, overflow:'hidden' }}>
              {/* mac bar */}
              <div style={{ background:'rgba(0,0,0,.5)', padding:'14px 18px', display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ width:13, height:13, borderRadius:'50%', background:'#ff5f57' }}/>
                <div style={{ width:13, height:13, borderRadius:'50%', background:'#febc2e' }}/>
                <div style={{ width:13, height:13, borderRadius:'50%', background:'#28c840' }}/>
              </div>
              <div style={{ padding:22 }}>
                {activities.map((a, i) => (
                  <motion.div key={i}
                    animate={{ borderColor: ['rgba(255,255,255,.06)','rgba(255,255,255,.18)','rgba(255,255,255,.06)'] }}
                    transition={{ duration:3, delay: i*1, repeat:Infinity }}
                    style={{
                      display:'flex', alignItems:'center', gap:14,
                      padding:15, borderRadius:12,
                      background:'rgba(255,255,255,.035)',
                      border:'1px solid rgba(255,255,255,.06)',
                      marginBottom: i < activities.length-1 ? 10 : 0
                    }}
                  >
                    <div style={{ width:42, height:42, borderRadius:11, background:a.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.15rem', flexShrink:0 }}>{a.icon}</div>
                    <div>
                      <strong style={{ display:'block', fontSize:'.87rem', color:'#fff', fontWeight:600 }}>{a.title}</strong>
                      <p style={{ fontSize:'.78rem', color:'var(--text-dim)', marginTop:2 }}>{a.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <ScrollReveal delay={0.18} style={{ flex:'1 1 260px', maxWidth:380 }}>
            <div>
              {steps.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-24 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:.6, delay: i*0.15, ease:[.22,1,.36,1] }}
                  style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom: i < steps.length-1 ? 30 : 0 }}
                >
                  <div style={{
                    width:38, height:38, borderRadius:12, flexShrink:0,
                    background:'rgba(0,229,255,.1)', border:'1px solid rgba(0,229,255,.25)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Syne',sans-serif", fontWeight:800, color:'var(--accent)', fontSize:'.92rem'
                  }}>{i+1}</div>
                  <div>
                    <h4 style={{ color:'#fff', fontSize:'.94rem', fontWeight:600, marginBottom:5 }}>{s.title}</h4>
                    <p style={{ color:'var(--text-dim)', fontSize:'.81rem', lineHeight:1.64 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
