const API_URL = import.meta.env.VITE_API_URL
const SERVER_CONNECTION_ERROR = 'Не удалось подключиться к серверу'

function getCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : ''
}

async function request(path, options = {}) {
  if (!API_URL) {
    const error = new Error(SERVER_CONNECTION_ERROR)
    error.status = 0
    throw error
  }

  const method = (options.method || 'GET').toUpperCase()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const csrfToken = getCookie('csrftoken')

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }
  }

  let response

  try {
    response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    })
  } catch {
    const error = new Error(SERVER_CONNECTION_ERROR)
    error.status = 0
    throw error
  }

  if (response.status === 204) {
    return null
  }

  let data

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (path === '/admin/me/' && response.status === 401) {
    return null
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      Object.values(data || {})
        .flat()
        .join(' ') ||
      SERVER_CONNECTION_ERROR
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  getCsrf: () => request('/csrf/'),
  adminLogin: async (payload) => {
    await request('/csrf/')
    return request('/admin/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  adminMe: () => request('/admin/me/'),
  adminLogout: () =>
    request('/admin/logout/', {
      method: 'POST',
    }),
  getSettings: () => request('/settings/'),
  getReviews: () => request('/reviews/'),
  getServices: () => request('/services/'),
  getServiceCategories: () => request('/service-categories/'),
  getServiceOptions: () => request('/service-options/'),
  createLead: (payload) =>
    request('/leads/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAdminDashboard: () => request('/admin/dashboard/'),
  getAdminServices: () => request('/admin/services/'),
  createAdminService: (payload) =>
    request('/admin/services/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAdminService: (id, payload) =>
    request(`/admin/services/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAdminService: (id) =>
    request(`/admin/services/${id}/`, {
      method: 'DELETE',
    }),
  getAdminCategories: () => request('/admin/categories/'),
  createAdminCategory: (payload) =>
    request('/admin/categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAdminCategory: (id, payload) =>
    request(`/admin/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAdminCategory: (id) =>
    request(`/admin/categories/${id}/`, {
      method: 'DELETE',
    }),
  getAdminOptions: () => request('/admin/options/'),
  createAdminOption: (payload) =>
    request('/admin/options/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAdminOption: (id, payload) =>
    request(`/admin/options/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAdminOption: (id) =>
    request(`/admin/options/${id}/`, {
      method: 'DELETE',
    }),
  getAdminLeads: () => request('/admin/leads/'),
  updateAdminLead: (id, payload) =>
    request(`/admin/leads/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  updateSettings: (payload) =>
    request('/admin/settings/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}
