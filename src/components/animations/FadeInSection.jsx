import { motion } from 'framer-motion'

const fadeVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

const motionTags = {
  article: motion.article,
  aside: motion.aside,
  div: motion.div,
  header: motion.header,
  section: motion.section,
}

function FadeInSection({
  as = 'div',
  children,
  className = '',
  delay = 0,
  amount = 0.18,
}) {
  const Component = motionTags[as] || motion.div

  return (
    <Component
      className={className}
      variants={fadeVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  )
}

export default FadeInSection
