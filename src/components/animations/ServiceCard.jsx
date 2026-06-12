import { Clock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

function ServiceCard({ action, service }) {
  return (
    <motion.article
      className="service-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{
        y: -6,
        boxShadow: '0 34px 86px rgba(63, 45, 55, 0.14)',
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="service-card-top">
        <span className="icon-badge">
          <CheckCircle2 size={23} />
        </span>
        <span className="service-price">{service.price}</span>
      </div>
      <h2>{service.title}</h2>
      <p>{service.description}</p>
      <div className="service-meta">
        <Clock size={18} />
        {service.meta}
      </div>
      {action}
    </motion.article>
  )
}

export default ServiceCard
