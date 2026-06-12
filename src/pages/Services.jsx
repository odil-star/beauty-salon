import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BadgeDollarSign,
  CalendarCheck,
  Clock,
  RefreshCcw,
  Sparkles,
} from 'lucide-react'
import { api } from '../api/client'
import AnimatedButton from '../components/animations/AnimatedButton'
import FadeInSection from '../components/animations/FadeInSection'
import ServiceCard from '../components/animations/ServiceCard'
import Seo from '../components/Seo'
import useSiteSettings from '../hooks/useSiteSettings'
import { buildBeautySalonJsonLd } from '../utils/seo'

const serviceFaqs = [
  {
    question: 'Как рассчитывается итоговая цена?',
    answer: 'Цена складывается из основной услуги, выбранных дополнительных услуг и активных опций, например длины волос или тонирования.',
  },
  {
    question: 'Можно ли записаться на несколько услуг сразу?',
    answer: 'Да, выберите основную услугу, добавьте уход, укладку или консультацию, а затем отправьте заявку на странице контактов.',
  },
  {
    question: 'Что выбрать перед первым визитом?',
    answer: 'Если вы не уверены, выберите консультацию мастера или напишите пожелания в комментарии к заявке.',
  },
]

function formatPrice(price) {
  return `${Number(price).toLocaleString('ru-RU')} сум`
}

function buildBookingUrl(service, selectedAdditions, selectedOptions, totalPrice) {
  const selectedItems = [
    ...selectedOptions.map((option) => ({
      type: 'option',
      id: option.id,
      title: option.title,
      extra_price: Number(option.extra_price),
    })),
    ...selectedAdditions.map((item) => ({
      type: 'additional_service',
      id: item.id,
      title: item.title,
      extra_price: Number(item.base_price),
    })),
  ]

  const params = new URLSearchParams({
    service: String(service.id),
    total: String(totalPrice),
    selected_options: JSON.stringify(selectedItems),
  })

  return `/contact?${params.toString()}`
}

function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedAdditionalIds, setSelectedAdditionalIds] = useState([])
  const [selectedOptionIds, setSelectedOptionIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const settings = useSiteSettings()

  useEffect(() => {
    Promise.all([api.getServices(), api.getServiceCategories()])
      .then(([serviceItems, categoryItems]) => {
        setServices(serviceItems)
        setCategories(categoryItems)
        setSelectedServiceId(
          serviceItems.find((service) => service.category_type === 'main')?.id || '',
        )
        setError('')
      })
      .catch((requestError) => {
        setError(requestError.message || 'Не удалось загрузить услуги.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const mainServices = useMemo(
    () => services.filter((service) => service.category_type === 'main'),
    [services],
  )
  const additionalServices = useMemo(
    () => services.filter((service) => service.category_type === 'additional'),
    [services],
  )

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(selectedServiceId)),
    [selectedServiceId, services],
  )

  const availableOptions = useMemo(
    () => selectedService?.options?.filter((option) => option.is_active) || [],
    [selectedService],
  )

  const selectedAdditionalServices = useMemo(
    () =>
      additionalServices.filter((service) => selectedAdditionalIds.includes(service.id)),
    [additionalServices, selectedAdditionalIds],
  )

  const selectedOptions = useMemo(
    () => availableOptions.filter((option) => selectedOptionIds.includes(option.id)),
    [availableOptions, selectedOptionIds],
  )

  const totalPrice = useMemo(() => {
    const mainPrice = Number(selectedService?.base_price || 0)
    const additionsPrice = selectedAdditionalServices.reduce(
      (sum, service) => sum + Number(service.base_price),
      0,
    )
    const optionsPrice = selectedOptions.reduce(
      (sum, option) => sum + Number(option.extra_price),
      0,
    )

    return mainPrice + additionsPrice + optionsPrice
  }, [selectedAdditionalServices, selectedOptions, selectedService])

  const toggleAdditional = (id) => {
    setSelectedAdditionalIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const toggleOption = (id) => {
    setSelectedOptionIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const selectService = (id) => {
    setSelectedServiceId(id)
    setSelectedOptionIds([])
  }

  return (
    <main>
      <Seo
        title="Услуги салона красоты Алёна | Ташкент"
        description="Услуги салона красоты Алёна в Ташкенте: женские стрижки, окрашивание волос, укладки, макияж, брови, ресницы и уходовые процедуры."
        path="/services"
        jsonLd={buildBeautySalonJsonLd({
          path: '/services',
          telephone: settings.phone,
          address: settings.address,
        })}
      />

      <section className="page-hero compact">
        <motion.div
          className="container narrow"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Наши услуги</span>
          <h1>Соберите beauty-запись под себя.</h1>
          <p>
            Выберите основную услугу, добавьте уходы или опции и сразу увидьте
            примерную стоимость перед записью к Алёне.
          </p>
        </motion.div>
      </section>

      <section className="section services-builder-section">
        <div className="container">
          {isLoading && (
            <div className="state-line">
              <RefreshCcw size={20} />
              Загружаем услуги...
            </div>
          )}

          {error && <div className="state-line error">{error}</div>}

          {!isLoading && !error && (
            <>
              <FadeInSection className="section-heading split-heading">
                <div>
                  <span className="eyebrow">Категории</span>
                  <h2>Основные и дополнительные услуги.</h2>
                </div>
                <span className="builder-categories-count">
                  {categories.length} категории · {services.length} услуг
                </span>
              </FadeInSection>

              <div className="services-builder">
                <FadeInSection className="builder-column">
                  <div className="builder-panel">
                    <h2>Основные услуги</h2>
                    <div className="choice-grid">
                      {mainServices.map((service, index) => (
                        <motion.button
                          className={`service-choice ${
                            selectedService?.id === service.id ? 'active' : ''
                          }`}
                          type="button"
                          key={service.id}
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          whileHover={{ y: -4, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          animate={
                            selectedService?.id === service.id
                              ? { boxShadow: '0 24px 60px rgba(200, 95, 127, 0.2)' }
                              : { boxShadow: '0 0 0 rgba(200, 95, 127, 0)' }
                          }
                          transition={{ delay: index * 0.04, duration: 0.28 }}
                          onClick={() => selectService(service.id)}
                        >
                          <span className="choice-icon">
                            <Sparkles size={20} />
                          </span>
                          <strong>{service.title}</strong>
                          <small>{service.duration}</small>
                          <em>{formatPrice(service.base_price)}</em>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="builder-panel">
                    <h2>Дополнительные услуги</h2>
                    <div className="addon-list">
                      {additionalServices.map((service) => (
                        <label className="pretty-check" key={service.id}>
                          <input
                            type="checkbox"
                            checked={selectedAdditionalIds.includes(service.id)}
                            onChange={() => toggleAdditional(service.id)}
                          />
                          <span>
                            <strong>{service.title}</strong>
                            <small>
                              {service.duration} · +{formatPrice(service.base_price)}
                            </small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </FadeInSection>

                <FadeInSection as="aside" className="builder-summary" delay={0.1}>
                  <div className="summary-card">
                    <span className="eyebrow">Запись</span>
                    <h2>{selectedService?.title || 'Выберите услугу'}</h2>
                    {selectedService && <p>{selectedService.description}</p>}

                    <div className="summary-meta">
                      <div>
                        <Clock size={18} />
                        <span>{selectedService?.duration || 'Время уточняется'}</span>
                      </div>
                      <div>
                        <BadgeDollarSign size={18} />
                        <span>База: {formatPrice(selectedService?.base_price || 0)}</span>
                      </div>
                    </div>

                    {availableOptions.length > 0 && (
                      <div className="summary-options">
                        <h3>Опции услуги</h3>
                        {availableOptions.map((option) => (
                          <label className="pretty-check option-check" key={option.id}>
                            <input
                              type="checkbox"
                              checked={selectedOptionIds.includes(option.id)}
                              onChange={() => toggleOption(option.id)}
                            />
                            <span>
                              <strong>{option.title}</strong>
                              <small>+{formatPrice(option.extra_price)}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="selected-preview">
                      <h3>Вы выбрали</h3>
                      <ul>
                        {selectedService && <li>{selectedService.title}</li>}
                        {selectedOptions.map((option) => (
                          <li key={`option-${option.id}`}>{option.title}</li>
                        ))}
                        {selectedAdditionalServices.map((service) => (
                          <li key={`addition-${service.id}`}>{service.title}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="total-price">
                      <span>Примерная итоговая цена</span>
                      <strong>{formatPrice(totalPrice)}</strong>
                    </div>

                    {selectedService ? (
                      <AnimatedButton
                        className="primary-button"
                        to={buildBookingUrl(
                          selectedService,
                          selectedAdditionalServices,
                          selectedOptions,
                          totalPrice,
                        )}
                      >
                        <CalendarCheck size={19} />
                        Записаться
                      </AnimatedButton>
                    ) : (
                      <button className="primary-button" type="button" disabled>
                        <CalendarCheck size={19} />
                        Записаться
                      </button>
                    )}
                  </div>
                </FadeInSection>
              </div>

              <div className="service-grid compact-list">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={{
                      description: service.description,
                      meta: `${service.category_title} · ${service.duration}`,
                      price: formatPrice(service.base_price),
                      title: service.title,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <FadeInSection as="section" className="section muted seo-content-section">
        <div className="container two-column">
          <div className="copy-block">
            <span className="eyebrow">Наши услуги</span>
            <h2>Beauty-услуги в Ташкенте с понятной записью и прозрачной ценой.</h2>
            <p>
              В салоне красоты Алёна можно записаться на женскую стрижку, окрашивание волос, макияж, оформление
              бровей, ламинирование ресниц, укладку и восстановительный уход. На странице услуг вы сразу видите
              длительность процедуры и примерную стоимость.
            </p>
            <p>
              Для сложных процедур доступны дополнительные опции: длина волос, тонирование, осветление, тип макияжа
              или уход. Итоговая сумма помогает заранее понять бюджет визита.
            </p>
          </div>

          <div className="faq-list" aria-label="Часто задаваемые вопросы об услугах">
            {serviceFaqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>
    </main>
  )
}

export default Services
