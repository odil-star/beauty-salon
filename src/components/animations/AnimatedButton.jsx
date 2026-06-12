import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)

function AnimatedButton({
  children,
  className = 'primary-button',
  to,
  type = 'button',
  ...props
}) {
  const motionProps = {
    whileHover: { scale: 1.035, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  }

  if (to) {
    return (
      <MotionLink className={className} to={to} {...motionProps} {...props}>
        {children}
      </MotionLink>
    )
  }

  return (
    <motion.button className={className} type={type} {...motionProps} {...props}>
      {children}
    </motion.button>
  )
}

export default AnimatedButton
