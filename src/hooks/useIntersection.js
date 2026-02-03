import { useState, useEffect, useRef } from 'react'

export default function useIntersection(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el) // fire once
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px', ...options }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, []) // eslint-disable-line

  return [ref, visible]
}
