import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SYSTEM_PROMPT = `You are the friendly AI assistant for GetCalls — a startup that builds conversion-first websites for small businesses worldwide. 
Our services: custom websites with WhatsApp buttons, click-to-call, smart contact forms, SEO, mobile-first design. Live in 48 hours.
Pricing: Starter ₹2,000 | Pro ₹8,000 | Business ₹10,000 (one-time). Monthly plans also available.
Founder: Priyanshu Bhati | Phone: +91 9057278418 | Email: priyanshubhati.dev@gmail.com
Be concise, warm, and helpful. If the user wants to get started, tell them to click "Get Your Website Free" or "Pay Now" on the page. Keep answers under 3 short paragraphs.`

const starters = [
  '💰 How much does it cost?',
  '⏱️ How long does it take?',
  '📞 What features do I get?',
  '🤝 How do I get started?',
]

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState([{ role:'assistant', content:'Hey 👋 I\'m the GetCalls assistant. How can I help you today?' }])
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const [showStarters, setShowStarters] = useState(true)
  const scrollRef             = useRef(null)
  const inputRef              = useRef(null)

  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing])

  // focus input when opened
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus() }, [open])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg) return
    setInput('')
    setShowStarters(false)

    const newMsgs = [...msgs, { role:'user', content: userMsg }]
    setMsgs(newMsgs)
    setTyping(true)

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey || apiKey === 'sk-your_key_here') {
      // fallback if no key
      setTimeout(() => {
        setMsgs(prev => [...prev, { role:'assistant', content:"I'm sorry, the AI assistant isn't configured yet. Please contact us directly at priyanshubhati.dev@gmail.com or call +91 9057278418 😊" }])
        setTyping(false)
      }, 900)
      return
    }

    try {
      const history = newMsgs.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role:'system', content: SYSTEM_PROMPT }, ...history],
          max_tokens: 300,
          stream: true
        })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      // add empty assistant msg to stream into
      setMsgs(prev => [...prev, { role:'assistant', content:'' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream:true })
        // parse SSE lines
        chunk.split('\n').forEach(line => {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') return
          try {
            const json = JSON.parse(line.slice(6))
            const delta = json.choices?.[0]?.delta?.content || ''
            assistantText += delta
            // update last message
            setMsgs(prev => {
              const copy = [...prev]
              copy[copy.length - 1] = { ...copy[copy.length-1], content: assistantText }
              return copy
            })
          } catch (_) {}
        })
      }
      setTyping(false)
    } catch (err) {
      console.error('OpenAI err:', err)
      setMsgs(prev => [...prev, { role:'assistant', content:'Oops, something went wrong. Please try again or contact us directly!' }])
      setTyping(false)
    }
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      {/* Bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position:'fixed', bottom:28, right:28, zIndex:400,
          width:60, height:60, borderRadius:'50%',
          background:'linear-gradient(135deg, var(--accent), #00b8d9)',
          border:'none', cursor:'pointer',
          boxShadow:'0 4px 24px var(--accent-glow)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: open ? '1.6rem' : '1.8rem',
          transition:'font-size .2s'
        }}
      >{open ? '✕' : '💬'}</motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:24, scale:.94 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:24, scale:.94 }}
            transition={{ duration:.38, ease:[.22,1,.36,1] }}
            style={{
              position:'fixed', bottom:100, right:28, width:340, height:480,
              zIndex:399,
              background:'#111118',
              border:'1px solid rgba(255,255,255,.1)',
              borderRadius:22,
              display:'flex', flexDirection:'column',
              boxShadow:'0 16px 56px rgba(0,0,0,.5)',
              overflow:'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              background:'linear-gradient(135deg, rgba(0,229,255,.15), rgba(0,229,255,.05))',
              borderBottom:'1px solid rgba(255,255,255,.08)',
              padding:'16px 18px', display:'flex', alignItems:'center', gap:12
            }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), #00b8d9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🤖</div>
              <div>
                <p style={{ color:'#fff', fontSize:'.88rem', fontWeight:700 }}>GetCalls Assistant</p>
                <p style={{ color:'var(--accent)', fontSize:'.72rem' }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:10 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth:'82%', padding:'10px 14px', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role==='user' ? 'var(--accent)' : 'rgba(255,255,255,.06)',
                    color: m.role==='user' ? '#0a0a0a' : '#fff',
                    fontSize:'.82rem', lineHeight:1.55, fontWeight: m.role==='user' ? 600 : 400,
                    wordBreak:'break-word'
                  }}>{m.content}</div>
                </div>
              ))}

              {/* Starter questions */}
              {showStarters && (
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                  {starters.map((s, i) => (
                    <button key={i} onClick={() => send(s)} style={{
                      background:'rgba(0,229,255,.08)', border:'1px solid rgba(0,229,255,.2)',
                      color:'var(--accent)', borderRadius:12, padding:'8px 12px',
                      fontSize:'.78rem', fontWeight:600, cursor:'pointer', textAlign:'left',
                      transition:'background .2s'
                    }}
                      onMouseEnter={e => e.target.style.background='rgba(0,229,255,.15)'}
                      onMouseLeave={e => e.target.style.background='rgba(0,229,255,.08)'}
                    >{s}</button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display:'flex', justifyContent:'flex-start' }}>
                  <div style={{ background:'rgba(255,255,255,.06)', borderRadius:'16px 16px 16px 4px', padding:'10px 16px', display:'flex', gap:4, alignItems:'center' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-dim)', animation:'bounce .9s infinite' }}/>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-dim)', animation:'bounce .9s .15s infinite' }}/>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-dim)', animation:'bounce .9s .3s infinite' }}/>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', padding:12, display:'flex', gap:8, alignItems:'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type a message…"
                style={{
                  flex:1, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)',
                  borderRadius:12, padding:'10px 14px', color:'#fff',
                  fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', outline:'none',
                  transition:'border-color .25s'
                }}
                onFocus={e => e.target.style.borderColor='rgba(0,229,255,.4)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'}
              />
              <button onClick={() => send()} disabled={!input.trim()} style={{
                width:38, height:38, borderRadius:'50%', border:'none',
                background: input.trim() ? 'var(--accent)' : 'rgba(255,255,255,.08)',
                color: input.trim() ? '#0a0a0a' : 'var(--text-dim)',
                cursor: input.trim() ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.1rem', transition:'background .2s'
              }}>↑</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}`}</style>
    </>
  )
}
