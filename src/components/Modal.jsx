import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ModalCtx = createContext()
export const useModal = () => useContext(ModalCtx)

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(null)
  const [ctx, setCtx]   = useState({})

  const openModal  = useCallback((id, payload = {}) => { setOpen(id); setCtx(payload) }, [])
  const closeModal = useCallback(() => { setOpen(null); setCtx({}) }, [])

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, closeModal])

  // memoized — consumers only re-render when open or ctx actually change
  const value = useMemo(() => ({ open, ctx, openModal, closeModal }), [open, ctx, openModal, closeModal])

  return (
    <ModalCtx.Provider value={value}>
      {children}
    </ModalCtx.Provider>
  )
}

/* ── Reusable <Modal id="xxx"> wrapper ── */
export function Modal({ id, children, maxWidth = 460 }) {
  const { open, closeModal } = useModal()
  const isOpen = open === id

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={closeModal}
          style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,.64)',
            backdropFilter:'blur(5px)',
            WebkitBackdropFilter:'blur(5px)',
            zIndex:500,
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:20
          }}
        >
          <motion.div
            initial={{ opacity:0, y:28, scale:.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:20, scale:.96 }}
            transition={{ duration:.38, ease:[.22,1,.36,1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background:'#12121a',
              border:'1px solid rgba(255,255,255,.08)',
              borderRadius:24,
              width:'100%', maxWidth,
              maxHeight:'90vh', overflowY:'auto',
              padding:'38px 30px 34px',
              position:'relative'
            }}
          >
            <button onClick={closeModal} style={{
              position:'absolute', top:18, right:20,
              background:'none', border:'none', color:'#6a6a7c',
              fontSize:'1.55rem', cursor:'pointer', lineHeight:1,
              transition:'color .2s'
            }}
              onMouseEnter={e => e.target.style.color='#fff'}
              onMouseLeave={e => e.target.style.color='#6a6a7c'}
            >×</button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
