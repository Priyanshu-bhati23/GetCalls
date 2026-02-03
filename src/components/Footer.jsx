import React from 'react'
import { useModal } from './Modal'

export default function Footer() {
  const { openModal } = useModal()

  return (
    <footer style={{
      position:'relative', zIndex:1,
      padding:'48px 24px 32px',
      borderTop:'1px solid rgba(255,255,255,.06)',
      background:'rgba(8,8,10,.95)'
    }}>
      <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:40, justifyContent:'space-between' }}>
        {/* Brand */}
        <div style={{ flex:'1 1 200px', maxWidth:280 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.3rem', color:'#fff', letterSpacing:'-1px', marginBottom:10 }}>
            Get<span style={{ color:'var(--accent)' }}>Calls</span>
          </div>
          <p style={{ fontSize:'.8rem', color:'var(--text-dim)', lineHeight:1.65 }}>
            Conversion-first websites for small businesses worldwide. Built to get you customers — not just traffic.
          </p>
        </div>

        {/* Contact */}
        <div style={{ flex:'1 1 180px' }}>
          <h5 style={{ color:'#fff', fontSize:'.78rem', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:14, fontWeight:600 }}>Contact</h5>
          <p style={{ fontSize:'.8rem', color:'var(--text-dim)', marginBottom:6 }}>
            <strong style={{ color:'var(--text-mid)' }}>Founder:</strong> Priyanshu Bhati
          </p>
          <p style={{ fontSize:'.8rem', color:'var(--text-dim)', marginBottom:6 }}>
            <strong style={{ color:'var(--text-mid)' }}>Phone:</strong>{' '}
            <a href="tel:+919057278418" style={{ color:'var(--accent)', textDecoration:'none' }}>+91 9057278418</a>
          </p>
          <p style={{ fontSize:'.8rem', color:'var(--text-dim)', marginBottom:6 }}>
            <strong style={{ color:'var(--text-mid)' }}>Email:</strong>{' '}
            <a href="mailto:priyanshubhati.dev@gmail.com" style={{ color:'var(--accent)', textDecoration:'none' }}>priyanshubhati.dev@gmail.com</a>
          </p>
        </div>

        {/* Quick links */}
        <div style={{ flex:'1 1 140px' }}>
          <h5 style={{ color:'#fff', fontSize:'.78rem', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:14, fontWeight:600 }}>Links</h5>
          {[
            { label:'Privacy Policy', modal:'policy', tab:'privacy' },
            { label:'Terms of Service', modal:'policy', tab:'terms' },
          ].map((l, i) => (
            <p key={i} style={{ marginBottom:8 }}>
              <a href="#" onClick={e => { e.preventDefault(); openModal(l.modal, { tab: l.tab }) }}
                style={{ color:'var(--text-dim)', textDecoration:'none', fontSize:'.8rem', transition:'color .2s' }}
                onMouseEnter={e => e.target.style.color='var(--accent)'}
                onMouseLeave={e => e.target.style.color='var(--text-dim)'}
              >{l.label}</a>
            </p>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth:900, margin:'32px auto 0', paddingTop:24, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, alignItems:'center' }}>
        <p style={{ fontSize:'.74rem', color:'var(--text-dim)' }}>© 2026 GetCalls. All rights reserved.</p>
        <p style={{ fontSize:'.74rem', color:'var(--text-dim)' }}>Built with ❤️ by Priyanshu Bhati</p>
      </div>
    </footer>
  )
}
