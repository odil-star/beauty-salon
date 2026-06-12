import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  Scissors,
  Sparkles,
  X,
} from 'lucide-react'
import AnimatedButton from '../components/animations/AnimatedButton'
import AnimatedCounter from '../components/animations/AnimatedCounter'
import FadeInSection from '../components/animations/FadeInSection'
import Seo from '../components/Seo'
import useSiteSettings from '../hooks/useSiteSettings'
import { buildBeautySalonJsonLd } from '../utils/seo'
import { api } from '../api/client'
import salonHero from '../assets/salon-hero.png'
import heroImage from '../assets/hero.png'

const benefits = [
  {
    icon: Sparkles,
    title: 'Образ под вашу внешность',
    text: 'Алёна учитывает форму лица, оттенок кожи, состояние волос и ваш привычный стиль.',
  },
  {
    icon: Scissors,
    title: 'Один мастер от начала до финала',
    text: 'Консультация, процедура, уход и укладка проходят в спокойном персональном формате.',
  },
  {
    icon: CheckCircle2,
    title: 'Чистая техника и бережный уход',
    text: 'В работе используются профессиональные средства, мягкие составы и аккуратная диагностика.',
  },
]

const popularServices = [
  {
    title: 'Окрашивание волос',
    price: 'от 480 000 сум',
    text: 'Мягкий цвет, аккуратные переходы и подбор оттенка под ваш образ.',
  },
  {
    title: 'Женская стрижка',
    price: 'от 180 000 сум',
    text: 'Форма, которая легко укладывается дома и красиво отрастает.',
  },
  {
    title: 'Макияж',
    price: 'от 250 000 сум',
    text: 'Свежий дневной, вечерний или праздничный макияж без тяжести.',
  },
  {
    title: 'Ламинирование ресниц',
    price: 'от 220 000 сум',
    text: 'Выразительный взгляд, ухоженный изгиб и натуральный эффект.',
  },
]

const reasons = [
  'Подробная консультация перед каждой процедурой',
  'Уютная запись без потока клиентов и спешки',
  'Рекомендации по домашнему уходу после визита',
  'Аккуратная работа с волосами, бровями, ресницами и макияжем',
]

const stats = [
  { label: 'клиентов', suffix: '+', value: 500 },
  { label: 'лет опыта', suffix: '', value: 10 },
  { label: 'довольных клиентов', suffix: '%', value: 98 },
]

const testimonials = [
  {
    name: 'Мадина',
    text: 'Алёна очень внимательно подобрала оттенок, волосы после окрашивания выглядят живыми и ухоженными.',
  },
  {
    name: 'Сабина',
    text: 'Макияж продержался весь вечер, но выглядел мягко и естественно. Именно то, что я хотела.',
  },
  {
    name: 'Наргиза',
    text: 'Понравилось, что мастер не торопится и объясняет каждый шаг. После визита легко ухаживать за волосами дома.',
  },
]

const galleryItems = [
  { image: salonHero, title: 'Мягкое окрашивание', text: 'Теплый оттенок и бережный уход за длиной.' },
  { image: heroImage, title: 'Вечерний образ', text: 'Легкая укладка и выразительные детали.' },
  { image: salonHero, title: 'Уход после окрашивания', text: 'Блеск, гладкость и плотность волос.' },
  { image: heroImage, title: 'Женственная укладка', text: 'Воздушный объем без перегруза.' },
]

const faqs = [
  {
    question: 'Можно ли записаться онлайн?',
    answer: 'Да, оставьте заявку на сайте, и Алёна свяжется с вами, чтобы подобрать удобную дату, время и услугу.',
  },
  {
    question: 'Где находится салон красоты Алёна?',
    answer: 'Салон расположен в центре Ташкента. Точный адрес и карта доступны на странице контактов.',
  },
  {
    question: 'Можно ли прийти на консультацию перед окрашиванием?',
    answer: 'Да, перед сложным окрашиванием мастер оценивает состояние волос, историю процедур и желаемый оттенок.',
  },
]

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.16,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
}

function Home() {
  const [activeReview, setActiveReview] = useState(0)
  const [reviews, setReviews] = useState(testimonials)
  const [selectedImage, setSelectedImage] = useState(null)
  const settings = useSiteSettings()

  useEffect(() => {
    let isMounted = true

    api
      .getReviews()
      .then((items) => {
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setReviews(items)
          setActiveReview(0)
        }
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length)
    }, 4600)

    return () => window.clearInterval(timer)
  }, [reviews.length])

  return (
    <main>
      <Seo
        title="Алёна — Салон красоты в Ташкенте | Стрижки, окрашивание, макияж"
        description="Салон красоты Алёна в Ташкенте. Стрижки, окрашивание, макияж, брови, ресницы. Онлайн запись на удобное время."
        path="/"
        jsonLd={buildBeautySalonJsonLd({
          path: '/',
          telephone: settings.phone,
          address: settings.address,
        })}
      />

      <section
        className="home-hero"
        style={{ '--hero-image': `url(${salonHero})` }}
      >
        <div className="hero-overlay">
          <motion.div
            className="container hero-content"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="eyebrow hero-logo-kicker" variants={heroItem}>
              Салон красоты одного мастера
            </motion.span>
            <motion.h1 variants={heroItem}>Алёна</motion.h1>
            <motion.p variants={heroItem}>
              Премиальный уход за волосами, макияж, брови и ресницы в центре
              Ташкента. Здесь образ подбирается не по шаблону, а под вашу
              внешность, настроение и образ жизни.
            </motion.p>
            <motion.div variants={heroItem}>
              <AnimatedButton className="primary-button hero-button" to="/contact">
                <CalendarCheck size={20} />
                Записаться
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FadeInSection as="section" className="section advantages">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Преимущества мастера</span>
            <h2>Красивый результат, который удобно носить каждый день.</h2>
          </div>

          <div className="cards-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.article
                  className="benefit-card"
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  whileHover={{ y: -6 }}
                  transition={{ delay: index * 0.08, duration: 0.55 }}
                >
                  <span className="icon-badge">
                    <Icon size={24} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section muted counters-section">
        <div className="container stats-row">
          {stats.map((item) => (
            <div className="stat-card animated-stat-card" key={item.label}>
              <strong>
                <AnimatedCounter suffix={item.suffix} value={item.value} />
              </strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section popular-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Популярные услуги</span>
              <h2>Самые частые записи к Алёне.</h2>
            </div>
            <AnimatedButton className="secondary-button" to="/services">
              Смотреть все услуги
            </AnimatedButton>
          </div>

          <div className="popular-grid">
            {popularServices.map((service, index) => (
              <motion.article
                className="popular-card"
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ delay: index * 0.07, duration: 0.55 }}
              >
                <span>{service.price}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section muted why-section">
        <div className="container two-column">
          <div className="copy-block">
            <span className="eyebrow">Почему выбирают Алёну</span>
            <h2>Каждый визит похож на мягкую перезагрузку.</h2>
            <p>
              Алёна не работает на поток: для каждого гостя выделяется время на
              консультацию, диагностику и спокойное завершение образа. Вы уходите
              не только с красивым результатом, но и с понятным планом ухода.
            </p>
          </div>

          <div className="reason-list">
            {reasons.map((reason, index) => (
              <motion.div
                className="reason-item"
                key={reason}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.26 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <HeartHandshake size={22} />
                <span>{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section seo-content-section">
        <div className="container two-column">
          <div className="copy-block">
            <span className="eyebrow">О салоне</span>
            <h2>Салон красоты Алёна в Ташкенте для тех, кто ценит спокойный сервис.</h2>
            <p>
              Алёна работает с женскими стрижками, окрашиванием волос, макияжем, бровями и ресницами в формате
              персональной записи. Здесь нет спешки: мастер заранее обсуждает пожелания, подбирает технику под
              внешность и объясняет, как сохранить результат после визита.
            </p>
            <p>
              На сайте можно выбрать услугу, добавить опции, рассчитать примерную стоимость и отправить заявку
              на удобное время. Это помогает быстро записаться в салон красоты в Ташкенте без лишних звонков.
            </p>
          </div>

          <div className="faq-list" aria-label="Часто задаваемые вопросы">
            {faqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section testimonials-section">
        <div className="container two-column">
          <div className="copy-block">
            <span className="eyebrow">Отзывы</span>
            <h2>Клиенты возвращаются за спокойствием и вниманием.</h2>
            <p>
              Автопрокрутка отзывов мягко показывает впечатления клиентов без
              резких переключений.
            </p>
          </div>

          <div className="testimonial-slider">
            <AnimatePresence mode="wait">
              <motion.article
                className="testimonial-card"
                key={reviews[activeReview].name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <p>{reviews[activeReview].text}</p>
                <strong>{reviews[activeReview].name}</strong>
              </motion.article>
            </AnimatePresence>
            <div className="testimonial-dots">
              {reviews.map((review, index) => (
                <button
                  className={activeReview === index ? 'active' : ''}
                  type="button"
                  key={review.name}
                  aria-label={`Показать отзыв ${index + 1}`}
                  onClick={() => setActiveReview(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="section gallery-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Галерея работ</span>
              <h2>Мягкие детали, блеск волос и женственные образы.</h2>
            </div>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <motion.button
                className="gallery-card"
                type="button"
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                onClick={() => setSelectedImage(item)}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInSection>

      <section className="section cta-section">
        <motion.div
          className="container cta-band"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.62 }}
        >
          <div>
            <span className="eyebrow">Запись</span>
            <h2>Хотите обновить образ без стресса?</h2>
            <p>
              Оставьте заявку, и Алёна подскажет подходящую процедуру, время и
              подготовку к визиту.
            </p>
          </div>
          <AnimatedButton className="primary-button" to="/contact">
            <CalendarCheck size={20} />
            Записаться
          </AnimatedButton>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="gallery-modal-card"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="gallery-modal-close"
                type="button"
                aria-label="Закрыть изображение"
                onClick={() => setSelectedImage(null)}
              >
                <X size={19} />
              </button>
              <img src={selectedImage.image} alt={selectedImage.title} loading="lazy" />
              <div>
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.text}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Home
