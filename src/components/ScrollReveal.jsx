import React from 'react'
import { motion } from 'framer-motion'
import useIntersection from '../hooks/useIntersection'

export default function ScrollReveal({ children, delay = 0, className = '', style = {} }) {
  const [ref, visible] = useIntersection()

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 34 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
