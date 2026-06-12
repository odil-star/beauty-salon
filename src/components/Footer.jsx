import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { api } from '../api/client'
import {
  buildPhoneHref,
  buildTelegramHref,
  defaultSiteSettings,
  mergeSiteSettings,
} from '../utils/siteSettings'

const footerLinks = [
  { to: '/', label: 'Главная', end: true },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Наши услуги' },
  { to: '/works', label: 'Мои работы' },
  { to: '/contact', label: 'Контакты' },
]

function Footer() {
  const [settings, setSettings] = useState(defaultSiteSettings)

  useEffect(() => {
    let isMounted = true

    api
      .getSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(mergeSiteSettings(data))
        }
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Салон красоты Алёна">
            {settings.master_name}
          </Link>
          <p>
            Нежная beauty-студия одного мастера в центре Ташкента: волосы,
            макияж, брови и ресницы с персональным вниманием к каждой детали.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Навигация в footer">
          <strong>Меню</strong>
          {footerLinks.map((link) => (
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

        <div className="footer-contacts">
          <strong>Контакты</strong>
          {settings.phone && (
            <a href={buildPhoneHref(settings.phone)}>
              <Phone size={18} />
              {settings.phone}
            </a>
          )}
          {settings.telegram && (
            <a
              href={buildTelegramHref(settings.telegram)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              {settings.telegram}
            </a>
          )}
          {settings.address &&
            (settings.maps_url ? (
              <a href={settings.maps_url} target="_blank" rel="noreferrer">
                <MapPin size={18} />
                {settings.address}
              </a>
            ) : (
              <span>
                <MapPin size={18} />
                {settings.address}
              </span>
            ))}
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 {settings.master_name} Beauty Studio</span>
        <span>Красота в спокойном персональном формате</span>
      </div>
    </footer>
  )
}

export default Footer
