import salonHero from '../assets/salon-hero.png'

export const SEO_KEYWORDS = [
  'салон красоты ташкент',
  'окрашивание волос ташкент',
  'женская стрижка ташкент',
  'макияж ташкент',
  'брови ташкент',
  'ресницы ташкент',
  'запись в салон красоты',
  'парикмахер ташкент',
]

export const DEFAULT_OG_IMAGE = salonHero

const FALLBACK_SITE_URL = 'https://alena-beauty.uz'

function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL

  if (envUrl) {
    return envUrl.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return FALLBACK_SITE_URL
}

export function resolveSeoUrl(value = '/') {
  if (value.startsWith('http')) {
    return value
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`
  return `${getSiteUrl()}${normalizedPath}`
}

export function buildBeautySalonJsonLd({ path = '/', telephone, address, image = DEFAULT_OG_IMAGE } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${resolveSeoUrl(path)}#beautysalon`,
    name: 'Алёна',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address || 'Ташкент, центр города',
      addressLocality: 'Ташкент',
      addressCountry: 'UZ',
    },
    telephone: telephone || undefined,
    openingHours: ['Mo-Su 10:00-20:00'],
    image: resolveSeoUrl(image),
    url: resolveSeoUrl(path),
    priceRange: '$$',
    sameAs: [
      'https://t.me/alena_beauty',
      'https://instagram.com/alena_beauty',
    ],
  }
}
