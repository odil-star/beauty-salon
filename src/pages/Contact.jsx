import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Camera, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { api } from '../api/client'
import Seo from '../components/Seo'
import useSiteSettings from '../hooks/useSiteSettings'
import { buildBeautySalonJsonLd } from '../utils/seo'
import {
  buildInstagramHref,
  buildPhoneHref,
  buildTelegramHref,
} from '../utils/siteSettings'

const initialForm = {
  name: '',
  phone: '',
  service: '',
  selected_options: [],
  total: '',
  preferred_date: '',
  preferred_time: '',
  message: '',
  consent: false,
}

function parseSelectedOptions(value) {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function Contact() {
  const [searchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const settings = useSiteSettings()

  useEffect(() => {
    api
      .getServices()
      .then((items) => {
        setServices(items)
        const selectedService = searchParams.get('service')
        const selectedOptions = searchParams.get('selected_options')
        const total = searchParams.get('total')

        if (selectedService) {
          setForm((current) => ({
            ...current,
            service: selectedService,
            selected_options: parseSelectedOptions(selectedOptions),
            total: total || '',
          }))
        }
      })
      .catch(() => setServices([]))
  }, [searchParams])

  const updateField = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const submitLead = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', text: '' })

    const formData = new FormData(event.currentTarget)
    const selectedService = formData.get('service')

    try {
      await api.createLead({
        name: String(formData.get('name') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        service: selectedService ? Number(selectedService) : null,
        selected_options: form.selected_options,
        preferred_date: formData.get('preferred_date') || null,
        preferred_time: formData.get('preferred_time') || null,
        message: String(formData.get('message') || '').trim(),
        consent: formData.get('consent') === 'on',
      })
      setForm(initialForm)
      setStatus({
        type: 'success',
        text: 'Заявка отправлена. Алёна скоро свяжется с вами.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.message || 'Не удалось отправить заявку.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <Seo
        title="Контакты салона красоты Алёна | Ташкент"
        description="Контакты салона красоты Алёна в Ташкенте: телефон, Telegram, Instagram, адрес, Яндекс Карта и онлайн-заявка на удобное время."
        path="/contact"
        jsonLd={buildBeautySalonJsonLd({
          path: '/contact',
          telephone: settings.phone,
          address: settings.address,
        })}
      />

      <section className="page-hero compact">
        <div className="container narrow">
          <span className="eyebrow">Контакты</span>
          <h1>Запишитесь к Алёне на удобное время.</h1>
          <p>
            Напишите, какую услугу хотите, когда удобно прийти и какой результат
            хочется получить. Алёна ответит, подскажет подготовку и подтвердит
            запись.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          <form className="lead-form" onSubmit={submitLead}>
            <div className="form-intro">
              <span className="eyebrow">Заявка</span>
              <h2>Расскажите немного о желаемом образе.</h2>
              <p>
                Можно описать длину волос, оттенок, повод для макияжа или
                удобный день. Если не знаете, что выбрать, Алёна поможет
                определиться на консультации.
              </p>
            </div>

            <label>
              Имя
              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Ваше имя"
              />
            </label>

            <label>
              Телефон
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="Ваш номер телефона"
              />
            </label>

            <label>
              Услуга
              <select name="service" value={form.service} onChange={updateField}>
                <option value="">Подобрать вместе</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>

            {(form.selected_options.length > 0 || form.total) && (
              <div className="booking-summary">
                <strong>Выбранные параметры</strong>
                {form.selected_options.length > 0 && (
                  <ul>
                    {form.selected_options.map((item) => (
                      <li key={`${item.type}-${item.id || item.title}`}>
                        {item.title}
                        {Number(item.extra_price) > 0 &&
                          ` · +${Number(item.extra_price).toLocaleString('ru-RU')} сум`}
                      </li>
                    ))}
                  </ul>
                )}
                {form.total && (
                  <span>
                    Примерная цена: {Number(form.total).toLocaleString('ru-RU')} сум
                  </span>
                )}
              </div>
            )}

            <div className="form-row">
              <label>
                Желаемая дата
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={updateField}
                />
              </label>

              <label>
                Желаемое время
                <input
                  type="time"
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={updateField}
                />
              </label>
            </div>

            <label>
              Комментарий
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                rows="5"
                placeholder="Напишите удобное время, услугу или пожелания"
              />
            </label>

            <label className="consent-line">
              <input
                required
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={updateField}
              />
              <span>
                Я согласен(на) на обработку персональных данных для связи со
                мной и записи на услугу.
              </span>
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting || !form.consent}
            >
              <Send size={19} />
              {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
            </button>

            {status.text && <p className={`form-status ${status.type}`}>{status.text}</p>}
          </form>

          <aside className="contact-panel" itemScope itemType="https://schema.org/BeautySalon">
            <meta itemProp="name" content={settings.master_name} />
            <h2>Связь с мастером</h2>
            <p>
              {settings.master_name} отвечает в течение дня. Для срочной записи лучше написать в
              Telegram и указать желаемую дату.
            </p>
            <div className="contact-list">
              {settings.phone && (
                <a href={buildPhoneHref(settings.phone)}>
                  <Phone size={21} />
                  <span itemProp="telephone">{settings.phone}</span>
                </a>
              )}
              {settings.telegram && (
                <a
                  href={buildTelegramHref(settings.telegram)}
                  target="_blank"
                  rel="noreferrer"
                  itemProp="sameAs"
                >
                  <MessageCircle size={21} />
                  <span>{settings.telegram}</span>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={buildInstagramHref(settings.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  itemProp="sameAs"
                >
                  <Camera size={21} />
                  <span>{settings.instagram}</span>
                </a>
              )}
              {settings.address &&
                (settings.maps_url ? (
                  <a
                    href={settings.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <MapPin size={21} />
                    <span itemProp="streetAddress">{settings.address}</span>
                    <meta itemProp="addressLocality" content="Ташкент" />
                    <meta itemProp="addressCountry" content="UZ" />
                  </a>
                ) : (
                  <div
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <MapPin size={21} />
                    <span itemProp="streetAddress">{settings.address}</span>
                    <meta itemProp="addressLocality" content="Ташкент" />
                    <meta itemProp="addressCountry" content="UZ" />
                  </div>
                ))}
            </div>

            <section className="contact-map-card" aria-label="Как нас найти">
              <div className="contact-map-heading">
                <span className="eyebrow">Карта</span>
                <h2>Как нас найти</h2>
                <p>
                  Салон расположен в удобном месте. Вы можете построить маршрут
                  через Яндекс Карты.
                </p>
              </div>

              <div className="yandex-map-frame">
                <a
                  href="https://yandex.uz/maps/org/sharzan/87224519137/?utm_medium=mapframe&utm_source=maps"
                  className="yandex-map-link yandex-map-link-main"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sharzan
                </a>
                <a
                  href="https://yandex.uz/maps/10335/tashkent/category/beauty_salon/184105814/?utm_medium=mapframe&utm_source=maps"
                  className="yandex-map-link yandex-map-link-category"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Салон красоты в Ташкенте
                </a>
                <iframe
                  src="https://yandex.uz/map-widget/v1/?ll=69.340328%2C41.347438&mode=poi&poi%5Bpoint%5D=69.339871%2C41.347447&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D87224519137&z=19"
                  width="100%"
                  height="450"
                  frameBorder="1"
                  allowFullScreen
                  title="Яндекс Карта: салон красоты Sharzan в Ташкенте"
                />
              </div>

              <a
                className="secondary-button contact-map-button"
                href="https://yandex.uz/maps/org/sharzan/87224519137/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={19} />
                Открыть в Яндекс Картах
              </a>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Contact
