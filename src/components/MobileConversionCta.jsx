import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'

const POPUP_STORAGE_KEY = 'beauty-popup-shown'
const EXIT_SESSION_KEY = 'beauty-exit-cta-shown'

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches
}

function MobileConversionCta() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(() => isMobileViewport())
  const [showEntryPopup, setShowEntryPopup] = useState(false)
  const [showExitCta, setShowExitCta] = useState(false)

  const isContactPage = location.pathname === '/contact'

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const updateMobileState = () => setIsMobile(media.matches)

    updateMobileState()
    media.addEventListener('change', updateMobileState)

    return () => media.removeEventListener('change', updateMobileState)
  }, [])

  useEffect(() => {
    if (!isMobile || isContactPage || localStorage.getItem(POPUP_STORAGE_KEY)) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      localStorage.setItem(POPUP_STORAGE_KEY, 'true')
      setShowEntryPopup(true)
    }, 9000)

    return () => window.clearTimeout(timer)
  }, [isContactPage, isMobile])

  useEffect(() => {
    if (
      !isMobile ||
      isContactPage ||
      sessionStorage.getItem(EXIT_SESSION_KEY) === 'true'
    ) {
      return undefined
    }

    const showPrompt = () => {
      sessionStorage.setItem(EXIT_SESSION_KEY, 'true')
      setShowExitCta(true)
    }

    const timer = window.setTimeout(showPrompt, 45000)
    const handleScroll = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (documentHeight <= 0) {
        return
      }

      const scrollProgress = window.scrollY / documentHeight
      if (scrollProgress >= 0.7) {
        window.clearTimeout(timer)
        showPrompt()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isContactPage, isMobile])

  const goToContact = () => {
    setShowEntryPopup(false)
    setShowExitCta(false)
    navigate('/contact')
  }

  if (!isMobile) {
    return null
  }

  return (
    <>
      {!isContactPage && (
        <motion.button
          className="mobile-floating-cta"
          type="button"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.045 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={goToContact}
        >
          <Sparkles size={18} />
          Записаться сейчас
        </motion.button>
      )}

      <AnimatePresence>
        {showEntryPopup && (
          <motion.div
            className="mobile-cta-modal"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mobile-cta-dialog"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className="mobile-cta-close"
                type="button"
                aria-label="Закрыть"
                onClick={() => setShowEntryPopup(false)}
              >
                <X size={18} />
              </button>
              <span className="eyebrow">Запись</span>
              <h2>Хотите записаться на процедуру?</h2>
              <p>
                Оставьте заявку и мы свяжемся с вами для выбора удобного времени.
              </p>
              <div className="mobile-cta-dialog-actions">
                <button className="primary-button" type="button" onClick={goToContact}>
                  Записаться
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setShowEntryPopup(false)}
                >
                  Позже
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitCta && !showEntryPopup && !isContactPage && (
          <motion.div
            className="mobile-exit-cta"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.26 }}
          >
            <button
              className="mobile-cta-close"
              type="button"
              aria-label="Закрыть"
              onClick={() => setShowExitCta(false)}
            >
              <X size={17} />
            </button>
            <strong>Не уходите без записи</strong>
            <button className="primary-button" type="button" onClick={goToContact}>
              Оставить заявку
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileConversionCta
