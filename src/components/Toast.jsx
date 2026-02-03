import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastCtx = createContext()
export const useToast = () => useContext(ToastCtx)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const show = useCallback((msg, type = 'success', duration = 3200) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, msg, type }])
    if (duration > 0) {
      timers.current[id] = setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const icons = { success: '✓', info: '💡', error: '⚠' }

  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      <div style={{
        position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)',
        zIndex:600, display:'flex', flexDirection:'column', alignItems:'center', gap:10,
        pointerEvents:'none', width:'90%', maxWidth:380
      }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => dismiss(t.id)} style={{
            background:'#1c1c24', border:`1px solid ${t.type==='success'?'rgba(184,255,0,.28)':t.type==='error'?'rgba(255,90,90,.28)':'rgba(0,229,255,.28)'}`,
            borderRadius:14, padding:'13px 20px', display:'flex', alignItems:'center', gap:10,
            fontSize:'.84rem', color:'#fff', boxShadow:'0 8px 32px rgba(0,0,0,.45)',
            pointerEvents:'auto', cursor:'pointer', animation:'toastIn .38s cubic-bezier(.22,1,.36,1) both',
            whiteSpace:'nowrap'
          }}>
            <span style={{fontSize:'1.05rem'}}>{icons[t.type]||'💬'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastCtx.Provider>
  )
}
