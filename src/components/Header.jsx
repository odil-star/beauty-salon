import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Главная', end: true },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Наши услуги' },
  { to: '/works', label: 'Мои работы' },
  { to: '/contact', label: 'Контакты' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen)

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isMenuOpen)

    return () => {
      document.body.classList.remove('mobile-menu-open')
    }
  }, [isMenuOpen])

  useEffect(() => {
    const updateHeaderState = () => setIsScrolled(window.scrollY > 16)

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => window.removeEventListener('scroll', updateHeaderState)
  }, [])

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="brand" aria-label="Салон красоты Алёна" onClick={closeMenu}>
        <span className="brand-copy">
          <strong>Алёна</strong>
          <small>beauty studio</small>
        </span>
      </NavLink>

      <nav className="main-nav desktop-nav" aria-label="Основная навигация">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        className={`burger-button ${isMenuOpen ? 'open' : ''}`}
        type="button"
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-controls="mobile-menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        className={`mobile-menu-backdrop ${isMenuOpen ? 'open' : ''}`}
        type="button"
        aria-label="Закрыть меню"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <nav
        id="mobile-menu"
        className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}
        aria-label="Мобильная навигация"
      >
        <span className="mobile-nav-title">Меню</span>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
