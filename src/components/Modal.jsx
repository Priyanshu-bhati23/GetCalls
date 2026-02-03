import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ── Context ───────────────────────────── */
const ModalCtx = createContext(null)
export const useModal = () => useContext(ModalCtx)

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(null)   // active modal id
  const [ctx, setCtx]   = useState({})     // payload

  const openModal = useCallback((id, payload = {}) => {
    setOpen(id)
    setCtx(payload)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(null)
    setCtx({})
  }, [])

  // ESC key handler
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && closeModal()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, closeModal])

  return (
    <ModalCtx.Provider value={{ open, ctx, openModal, closeModal }}>
      {children}
    </ModalCtx.Provider>
  )
}

/* ── Modal Wrapper ─────────────────────── */
export function Modal({ id, children, maxWidth = 460 }) {
  const { open, closeModal } = useModal()
  const isOpen = open === id

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          background: 'rgba(0,0,0,.64)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onClick={closeModal}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 20,
            scale: isOpen ? 1 : 0.96,
          }}
          transition={{ duration: 0.38, ease: [.22, 1, .36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#12121a',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 24,
            width: '100%',
            maxWidth,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '38px 30px 34px',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: 18,
              right: 20,
              background: 'none',
              border: 'none',
              color: '#6a6a7c',
              fontSize: '1.55rem',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = '#6a6a7c')}
          >
            ×
          </button>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
