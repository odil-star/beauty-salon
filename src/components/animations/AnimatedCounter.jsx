import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'

function AnimatedCounter({ duration = 1.8, suffix = '', value }) {
  const ref = useRef(null)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`)
  const isInView = useInView(ref, { amount: 0.55, once: true })

  useEffect(() => {
    if (!isInView) {
      return undefined
    }

    const controls = animate(count, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })

    return () => controls.stop()
  }, [count, duration, isInView, value])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

export default AnimatedCounter
