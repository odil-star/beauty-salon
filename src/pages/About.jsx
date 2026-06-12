import { Award, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react'
import Seo from '../components/Seo'
import useSiteSettings from '../hooks/useSiteSettings'
import { buildBeautySalonJsonLd } from '../utils/seo'
import salonHero from '../assets/salon-hero.png'

const milestones = [
  { value: '8+', label: 'лет опыта в beauty-сфере' },
  { value: '1500+', label: 'довольных клиенток' },
  { value: '20+', label: 'курсов и сертификатов' },
]

const certificates = [
  'Колористика и безопасное осветление',
  'Современные женские стрижки',
  'Brow-мастер: форма и окрашивание',
  'Make-up для съемок и мероприятий',
]

const advantages = [
  'Работа с учетом состояния волос и кожи',
  'Объяснение каждого этапа процедуры',
  'Подбор домашнего ухода без лишних покупок',
  'Аккуратный результат, который красиво носится',
]

function About() {
  const settings = useSiteSettings()

  return (
    <main>
      <Seo
        title="О мастере Алёна | Салон красоты в Ташкенте"
        description="Познакомьтесь с мастером Алёной: опыт в beauty-сфере, бережный подход к волосам, макияжу, бровям и ресницам в Ташкенте."
        path="/about"
        jsonLd={buildBeautySalonJsonLd({
          path: '/about',
          telephone: settings.phone,
          address: settings.address,
        })}
      />

      <section className="page-hero compact">
        <div className="container narrow">
          <span className="eyebrow">О мастере</span>
          <h1>Алёна создает женственные образы, в которых легко быть собой.</h1>
          <p>
            Это салон одного мастера в центре Ташкента: без суеты, случайных
            исполнителей и потока клиентов. Каждый визит проходит лично у Алёны.
          </p>
        </div>
      </section>

      <section className="section about-grid">
        <div className="container two-column">
          <div className="copy-block">
            <h2>Мастер Алёна</h2>
            <p>
              Алёна работает с волосами, бровями, ресницами и макияжем более
              восьми лет. Ее главный принцип - не просто сделать красиво “здесь
              и сейчас”, а подобрать образ, который будет гармонично выглядеть
              каждый день.
            </p>
            <p>
              Перед процедурой мастер внимательно обсуждает пожелания, привычки
              ухода, историю окрашивания, особенности внешности и повод. Поэтому
              результат получается персональным, мягким и действительно вашим.
            </p>
            <div className="feature-list">
              <div>
                <Sparkles size={22} />
                <span>Профессиональная диагностика перед услугой</span>
              </div>
              <div>
                <HeartHandshake size={22} />
                <span>Деликатное общение и комфортная атмосфера</span>
              </div>
              <div>
                <Award size={22} />
                <span>Постоянное обучение и современные техники</span>
              </div>
            </div>
          </div>

          <div className="photo-frame">
            <img src={salonHero} alt="Интерьер beauty-студии Алёна" loading="lazy" />
            <div className="photo-caption">
              <strong>Алёна Beauty Studio</strong>
              <span>кабинет одного мастера в центре Ташкента</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container stats-row">
          {milestones.map((item) => (
            <div className="stat-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div className="copy-block">
            <span className="eyebrow">Сертификаты</span>
            <h2>Опыт, который подтвержден практикой и обучением.</h2>
            <p>
              Алёна регулярно проходит обучение по колористике, уходу за
              волосами, brow-направлению и макияжу, чтобы предлагать клиенткам
              современные, безопасные и эстетичные решения.
            </p>
          </div>
          <div className="certificate-grid">
            {certificates.map((certificate) => (
              <div className="certificate-card" key={certificate}>
                <Award size={22} />
                <span>{certificate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-advantages">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Подход к клиентам</span>
            <h2>Главное - чтобы вам было красиво, спокойно и понятно.</h2>
          </div>
          <div className="soft-grid">
            {advantages.map((advantage) => (
              <article className="soft-card" key={advantage}>
                <CheckCircle2 size={22} />
                <p>{advantage}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
