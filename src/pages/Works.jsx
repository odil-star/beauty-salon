import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Sparkles, X } from 'lucide-react'
import Seo from '../components/Seo'
import useSiteSettings from '../hooks/useSiteSettings'
import { buildBeautySalonJsonLd } from '../utils/seo'

const categories = [
  'Все',
  'Окрашивание',
  'Стрижки',
  'Укладки',
  'Макияж',
  'Брови',
  'Ресницы',
]

const works = [
  {
    id: 1,
    title: 'Мягкое окрашивание',
    category: 'Окрашивание',
    image: '../../public/03_vozdushnaya_ukladka.png',
    description: 'Нежный оттенок и плавный переход цвета без резких границ.',
  },
  {
    id: 2,
    title: 'Обновление формы',
    category: 'Стрижки',
    image: '../../public/08_dnevnoy_makiyazh.png',
    description: 'Лёгкая женская стрижка, которая красиво держит объём каждый день.',
  },
  {
    id: 3,
    title: 'Воздушная укладка',
    category: 'Укладки',
    image: '../../public/04_vecherniy_obraz.png',
    description: 'Мягкие волны, естественный блеск и аккуратное движение волос.',
  },
  {
    id: 4,
    title: 'Вечерний образ',
    category: 'Макияж',
    image: '../../public/06_laminirovanie_resnits.png',
    description: 'Выразительный макияж с сияющей кожей и деликатным акцентом на глаза.',
  },
  {
    id: 5,
    title: 'Архитектура бровей',
    category: 'Брови',
    image: '/images/work-5.jpg',
    description: 'Коррекция формы и мягкое окрашивание под черты лица клиента.',
  },
  {
    id: 6,
    title: 'Ламинирование ресниц',
    category: 'Ресницы',
    image: '/images/work-6.jpg',
    description: 'Открытый взгляд, натуральный изгиб и ухоженный эффект без туши.',
  },
  {
    id: 7,
    title: 'Тёплый блонд',
    category: 'Окрашивание',
    image: '/images/work-7.jpg',
    description: 'Светлый оттенок с бережной тонировкой и мягким уходом после процедуры.',
  },
  {
    id: 8,
    title: 'Гладкая укладка',
    category: 'Укладки',
    image: '/images/work-8.jpg',
    description: 'Полированная текстура, чистый силуэт и премиальный финиш.',
  },
  {
    id: 9,
    title: 'Дневной макияж',
    category: 'Макияж',
    image: '/images/work-9.jpg',
    description: 'Свежий образ на каждый день с натуральными оттенками и лёгким сиянием.',
  },
  {
    id: 10,
    title: 'Каре с мягкой линией',
    category: 'Стрижки',
    image: '/images/work-1.jpg',
    description: 'Аккуратная форма, которая подчёркивает шею и легко укладывается.',
  },
  {
    id: 11,
    title: 'Брови с ламинированием',
    category: 'Брови',
    image: '/images/work-2.jpg',
    description: 'Уложенные волоски, выразительная форма и естественный оттенок.',
  },
  {
    id: 12,
    title: 'Натуральный изгиб',
    category: 'Ресницы',
    image: '/images/work-3.jpg',
    description: 'Деликатный подъём ресниц для мягкого и открытого взгляда.',
  },
]

function WorkVisual({ className = '', work }) {
  const [hasImageError, setHasImageError] = useState(false)

  if (hasImageError) {
    return (
      <div className={`work-placeholder ${className}`}>
        <Sparkles size={28} />
        <span>{work.category}</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={work.image}
      alt={work.title}
      loading="lazy"
      onError={() => setHasImageError(true)}
    />
  )
}

function Works() {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [selectedWork, setSelectedWork] = useState(null)
  const settings = useSiteSettings()

  const filteredWorks = useMemo(() => {
    if (activeCategory === 'Все') {
      return works
    }

    return works.filter((work) => work.category === activeCategory)
  }, [activeCategory])

  return (
    <main>
      <Seo
        title="Портфолио работ | Алёна Салон красоты"
        description="Портфолио мастера Алёны: примеры окрашивания волос, женских стрижек, укладок, макияжа, бровей и ресниц для клиентов в Ташкенте."
        path="/works"
        jsonLd={buildBeautySalonJsonLd({
          path: '/works',
          telephone: settings.phone,
          address: settings.address,
        })}
      />

      <section className="page-hero compact works-hero">
        <motion.div
          className="container narrow"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Портфолио</span>
          <h1>Мои работы</h1>
          <p>
            Результаты процедур, окрашиваний, укладок и образов, выполненных
            для клиентов.
          </p>
        </motion.div>
      </section>

      <section className="section works-section">
        <div className="container">
          <div className="works-filter-bar" aria-label="Фильтр работ">
            {categories.map((category) => (
              <button
                className={`works-filter ${activeCategory === category ? 'active' : ''}`}
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div className="works-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work, index) => (
                <motion.article
                  className="work-card"
                  key={work.id}
                  layout
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.96 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    delay: index * 0.035,
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setSelectedWork(work)}
                >
                  <button className="work-card-button" type="button">
                    <div className="work-media">
                      <WorkVisual work={work} />
                    </div>
                    <div className="work-card-content">
                      <span>{work.category}</span>
                      <h2>{work.title}</h2>
                      <p>{work.description}</p>
                    </div>
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="section cta-section works-cta-section">
        <motion.div
          className="container cta-band"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span className="eyebrow">Запись</span>
            <h2>Хотите такой же результат?</h2>
            <p>
              Оставьте заявку, и Алёна подберёт услугу, оттенок, уход или образ
              под ваши волосы, черты лица и событие.
            </p>
          </div>
          <Link className="primary-button" to="/contact">
            <CalendarCheck size={20} />
            Записаться
          </Link>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedWork && (
          <motion.div
            className="work-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              className="work-lightbox-card"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="work-lightbox-close"
                type="button"
                aria-label="Закрыть"
                onClick={() => setSelectedWork(null)}
              >
                <X size={19} />
              </button>
              <div className="work-lightbox-media">
                <WorkVisual work={selectedWork} />
              </div>
              <div className="work-lightbox-content">
                <span>{selectedWork.category}</span>
                <h2>{selectedWork.title}</h2>
                <p>{selectedWork.description}</p>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setSelectedWork(null)}
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Works
