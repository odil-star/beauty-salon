export const defaultSiteSettings = {
  master_name: 'Алёна',
  phone: '',
  telegram: '',
  instagram: '',
  address: '',
  maps_url: '',
}

export function mergeSiteSettings(settings) {
  return {
    ...defaultSiteSettings,
    ...(settings || {}),
  }
}

export function buildPhoneHref(phone) {
  const normalized = String(phone || '').replace(/[^\d+]/g, '')
  return normalized ? `tel:${normalized}` : '#'
}

export function buildTelegramHref(telegram) {
  const value = String(telegram || '').trim()
  if (!value) {
    return '#'
  }
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  return `https://t.me/${value.replace(/^@/, '')}`
}

export function buildInstagramHref(instagram) {
  const value = String(instagram || '').trim()
  if (!value) {
    return '#'
  }
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  return `https://instagram.com/${value.replace(/^@/, '')}`
}
