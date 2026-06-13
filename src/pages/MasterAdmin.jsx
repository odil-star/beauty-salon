import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Circle,
  FolderTree,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { api } from '../api/client'
import { defaultSiteSettings, mergeSiteSettings } from '../utils/siteSettings'

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'services', label: 'Услуги', icon: Sparkles },
  { id: 'categories', label: 'Категории услуг', icon: FolderTree },
  { id: 'options', label: 'Опции услуг', icon: SlidersHorizontal },
  { id: 'leads', label: 'Заявки', icon: ListChecks },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

const sectionIds = sections.map((section) => section.id)
const LOCAL_ADMIN_STORAGE_KEY = 'alena-local-admin'
const LOCAL_ADMIN_USER = {
  id: 'local-master',
  username: 'master',
  first_name: 'Алёна',
  is_staff: true,
  is_superuser: true,
  is_local: true,
}

function getSectionFromPath(pathname) {
  const section = pathname.replace(/^\/master-admin\/?/, '').split('/')[0]
  return sectionIds.includes(section) ? section : 'dashboard'
}

function getSectionPath(sectionId) {
  return sectionId === 'dashboard' ? '/master-admin' : `/master-admin/${sectionId}`
}

function isLocalAdminCredentials(username, password) {
  return username === 'master' && password === 'admin1234'
}

function hasLocalAdminSession() {
  try {
    return window.localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function saveLocalAdminSession() {
  try {
    window.localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, 'true')
  } catch {
    // Local storage can be unavailable in private contexts.
  }
}

function clearLocalAdminSession() {
  try {
    window.localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY)
  } catch {
    // Local storage can be unavailable in private contexts.
  }
}

const emptyService = {
  category: '',
  title: '',
  description: '',
  base_price: '',
  duration: '',
  is_active: true,
}

const emptyCategory = {
  title: '',
  slug: '',
  type: 'main',
  sort_order: 0,
}

const emptyOption = {
  service: '',
  title: '',
  extra_price: '',
  is_active: true,
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString('ru-RU')} сум`
}

function formatLeadDate(value) {
  if (!value) {
    return 'Не указана'
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('ru-RU')
}

function formatLeadTime(value) {
  if (!value) {
    return 'Не указано'
  }

  return value.slice(0, 5)
}

function getGreeting(name) {
  const hour = new Date().getHours()
  if (hour < 12) {
    return `Доброе утро, ${name}`
  }
  if (hour < 18) {
    return `Добрый день, ${name}`
  }
  return `Добрый вечер, ${name}`
}

function AdminLayout({ activeSection, children, onLogout, onSectionChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('admin-sidebar-open', isSidebarOpen)

    return () => {
      document.body.classList.remove('admin-sidebar-open')
    }
  }, [isSidebarOpen])

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId)
    setIsSidebarOpen(false)
  }

  const handleLogout = () => {
    setIsSidebarOpen(false)
    onLogout()
  }

  return (
    <main className="admin-layout-root">
      <button
        className="admin-mobile-toggle"
        type="button"
        aria-label={isSidebarOpen ? 'Закрыть меню админки' : 'Открыть меню админки'}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <button
        className={`admin-sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`}
        type="button"
        aria-label="Закрыть меню админки"
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <strong>Алёна</strong>
          <span>beauty admin</span>
        </div>
        <nav aria-label="Разделы админки">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                className={activeSection === section.id ? 'active' : ''}
                type="button"
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
              >
                <Icon size={18} />
                {section.label}
              </button>
            )
          })}
          <button type="button" onClick={handleLogout}>
            <LogOut size={18} />
            Выйти
          </button>
        </nav>
      </aside>

      <section className="admin-content">{children}</section>
    </main>
  )
}

function SkeletonList({ count = 5 }) {
  return (
    <div className="admin-skeleton-grid" aria-label="Загрузка данных">
      {Array.from({ length: count }).map((_, index) => (
        <div className="admin-skeleton-card" key={index}>
          <span />
          <strong />
          <em />
        </div>
      ))}
    </div>
  )
}

function MasterAdmin() {
  const location = useLocation()
  const navigate = useNavigate()
  const hasStoredLocalAdmin = hasLocalAdminSession()
  const activeSection = getSectionFromPath(location.pathname)
  const [user, setUser] = useState(() => (hasStoredLocalAdmin ? LOCAL_ADMIN_USER : null))
  const [authProvider, setAuthProvider] = useState(() => (hasStoredLocalAdmin ? 'local' : ''))
  const [isAuthChecking, setIsAuthChecking] = useState(() => !hasStoredLocalAdmin)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [options, setOptions] = useState([])
  const [leads, setLeads] = useState([])
  const [serviceForm, setServiceForm] = useState(emptyService)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [optionForm, setOptionForm] = useState(emptyOption)
  const [settingsForm, setSettingsForm] = useState(defaultSiteSettings)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingOptionId, setEditingOptionId] = useState(null)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const openAdminSection = useCallback(
    (sectionId) => {
      navigate(getSectionPath(sectionId))
    },
    [navigate],
  )

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)

    try {
      if (authProvider === 'local') {
        const [serviceItems, categoryItems, optionItems, settingsData] = await Promise.all([
          api.getServices(),
          api.getServiceCategories(),
          api.getServiceOptions(),
          api.getSettings(),
        ])
        const normalizedSettings = mergeSiteSettings(settingsData)

        setDashboard({
          services_count: serviceItems.length,
          categories_count: categoryItems.length,
          options_count: optionItems.length,
          leads_count: 0,
          new_leads_count: 0,
          done_leads_count: 0,
        })
        setServices(serviceItems)
        setCategories(categoryItems)
        setOptions(optionItems)
        setLeads([])
        setSettingsForm(normalizedSettings)
        return
      }

      const [
        dashboardData,
        serviceItems,
        categoryItems,
        optionItems,
        leadItems,
        settingsData,
      ] =
        await Promise.all([
          api.getAdminDashboard(),
          api.getAdminServices(),
          api.getAdminCategories(),
          api.getAdminOptions(),
          api.getAdminLeads(),
          api.getSettings(),
        ])
      const normalizedSettings = mergeSiteSettings(settingsData)

      setDashboard(dashboardData)
      setServices(serviceItems)
      setCategories(categoryItems)
      setOptions(optionItems)
      setLeads(leadItems)
      setSettingsForm(normalizedSettings)
    } catch (error) {
      if (error.status === 401) {
        setUser(null)
        setAuthProvider('')
        return
      }

      setStatus(error.message || 'Не удалось загрузить данные.')
    } finally {
      setIsLoading(false)
    }
  }, [authProvider])

  useEffect(() => {
    if (authProvider) {
      return undefined
    }

    let isMounted = true

    api
      .adminMe()
      .then((data) => {
        if (isMounted) {
          setUser(data?.user || null)
          setAuthProvider(data?.user ? 'django' : '')
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
          setAuthProvider('')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthChecking(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [authProvider])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      loadDashboard()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadDashboard, user])

  useEffect(() => {
    if (!status) {
      return undefined
    }

    const timer = window.setTimeout(() => setStatus(''), 3600)
    return () => window.clearTimeout(timer)
  }, [status])

  const submitLogin = async (event) => {
    event.preventDefault()
    setLoginError('')
    setIsLoading(true)

    try {
      const username = loginForm.username.trim()
      const password = loginForm.password

      if (isLocalAdminCredentials(username, password)) {
        saveLocalAdminSession()
        setAuthProvider('local')
        setUser(LOCAL_ADMIN_USER)
        setLoginForm({ username: '', password: '' })
        setIsLoading(false)
        return
      }

      await api.adminLogin({
        username,
        password,
      })
      const session = await api.adminMe()
      if (!session?.user) {
        setUser(null)
        setAuthProvider('')
        setLoginError('Не удалось подтвердить вход. Попробуйте ещё раз.')
        return
      }
      setUser(session.user)
      setAuthProvider('django')
      setLoginForm({ username: '', password: '' })
    } catch (error) {
      setLoginError(error.message || 'Неверный логин или пароль.')
    } finally {
      setIsLoading(false)
    }

  }

  const logout = async () => {
    try {
      if (authProvider === 'django') {
        await api.adminLogout()
      }
    } catch {
      // Session may already be expired; the UI should still return to login.
    } finally {
      clearLocalAdminSession()
      setUser(null)
      setAuthProvider('')
      setDashboard(null)
      openAdminSection('dashboard')
    }
  }

  const updateServiceField = (event) => {
    const { checked, name, type, value } = event.target
    setServiceForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateCategoryField = (event) => {
    const { name, value } = event.target
    setCategoryForm((current) => ({ ...current, [name]: value }))
  }

  const updateOptionField = (event) => {
    const { checked, name, type, value } = event.target
    setOptionForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateSettingsField = (event) => {
    const { name, value } = event.target
    setSettingsForm((current) => ({ ...current, [name]: value }))
  }

  const resetServiceForm = () => {
    setServiceForm(emptyService)
    setEditingServiceId(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategory)
    setEditingCategoryId(null)
  }

  const resetOptionForm = () => {
    setOptionForm(emptyOption)
    setEditingOptionId(null)
  }

  const submitService = async (event) => {
    event.preventDefault()
    setStatus('')

    const payload = {
      ...serviceForm,
      category: Number(serviceForm.category),
      base_price: Number(serviceForm.base_price || 0).toFixed(2),
    }

    try {
      if (editingServiceId) {
        await api.updateAdminService(editingServiceId, payload)
        setStatus('Услуга обновлена.')
      } else {
        await api.createAdminService(payload)
        setStatus('Услуга добавлена.')
      }
      resetServiceForm()
      await loadDashboard()
    } catch (error) {
      setStatus(error.message || 'Не удалось сохранить услугу.')
    }
  }

  const submitCategory = async (event) => {
    event.preventDefault()
    setStatus('')

    const payload = {
      ...categoryForm,
      sort_order: Number(categoryForm.sort_order || 0),
    }

    try {
      if (editingCategoryId) {
        await api.updateAdminCategory(editingCategoryId, payload)
        setStatus('Категория обновлена.')
      } else {
        await api.createAdminCategory(payload)
        setStatus('Категория добавлена.')
      }
      resetCategoryForm()
      await loadDashboard()
    } catch (error) {
      setStatus(error.message || 'Не удалось сохранить категорию.')
    }
  }

  const submitOption = async (event) => {
    event.preventDefault()
    setStatus('')

    const payload = {
      ...optionForm,
      service: Number(optionForm.service),
      extra_price: Number(optionForm.extra_price || 0).toFixed(2),
    }

    try {
      if (editingOptionId) {
        await api.updateAdminOption(editingOptionId, payload)
        setStatus('Опция обновлена.')
      } else {
        await api.createAdminOption(payload)
        setStatus('Опция добавлена.')
      }
      resetOptionForm()
      await loadDashboard()
    } catch (error) {
      setStatus(error.message || 'Не удалось сохранить опцию.')
    }
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    setStatus('')

    try {
      const savedSettings = mergeSiteSettings(await api.updateSettings(settingsForm))
      setSettingsForm(savedSettings)
      setStatus('Настройки сохранены.')
    } catch (error) {
      setStatus(error.message || 'Не удалось сохранить настройки.')
    }
  }

  const editService = (service) => {
    openAdminSection('services')
    setEditingServiceId(service.id)
    setServiceForm({
      category: service.category || '',
      title: service.title,
      description: service.description,
      base_price: Number(service.base_price).toString(),
      duration: service.duration,
      is_active: service.is_active,
    })
  }

  const editCategory = (category) => {
    openAdminSection('categories')
    setEditingCategoryId(category.id)
    setCategoryForm({
      title: category.title,
      slug: category.slug,
      type: category.type,
      sort_order: category.sort_order,
    })
  }

  const editOption = (option) => {
    openAdminSection('options')
    setEditingOptionId(option.id)
    setOptionForm({
      service: option.service,
      title: option.title,
      extra_price: Number(option.extra_price).toString(),
      is_active: option.is_active,
    })
  }

  const deleteEntity = async (type, id) => {
    if (!window.confirm('Удалить запись?')) {
      return
    }

    try {
      if (type === 'service') {
        await api.deleteAdminService(id)
      }
      if (type === 'category') {
        await api.deleteAdminCategory(id)
      }
      if (type === 'option') {
        await api.deleteAdminOption(id)
      }
      setStatus('Запись удалена.')
      await loadDashboard()
    } catch (error) {
      setStatus(error.message || 'Не удалось удалить запись.')
    }
  }

  const toggleLeadDone = async (lead) => {
    try {
      await api.updateAdminLead(lead.id, { is_done: !lead.is_done })
      setStatus(lead.is_done ? 'Заявка возвращена в новые.' : 'Заявка обработана.')
      await loadDashboard()
    } catch (error) {
      setStatus(error.message || 'Не удалось обновить заявку.')
    }
  }

  const displayName = user?.first_name || user?.username || 'мастер'

  if (isAuthChecking) {
    return (
      <main className="admin-login-page">
        <div className="admin-login">
          <span className="eyebrow">Master access</span>
          <h1>Проверяем вход...</h1>
          <p className="form-status">Пожалуйста, подождите.</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="admin-login-page">
        <form className="admin-login" onSubmit={submitLogin}>
          <span className="eyebrow">Master access</span>
          <h1>Вход мастера</h1>
          <label>
            Логин
            <input
              name="username"
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              autoComplete="username"
            />
          </label>
          <label>
            Пароль
            <input
              name="password"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              autoComplete="current-password"
            />
          </label>
          <button className="primary-button" type="submit" disabled={isLoading}>
            <Check size={19} />
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
          {loginError && <p className="form-status error">{loginError}</p>}
        </form>
      </main>
    )
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onLogout={logout}
      onSectionChange={openAdminSection}
    >
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Панель мастера</span>
            <h1>{getGreeting(displayName)}</h1>
          </div>
          <button className="ghost-button" type="button" onClick={loadDashboard}>
            <RefreshCcw size={18} />
            Обновить
          </button>
        </header>

        <AnimatePresence>
          {status && (
            <motion.p
              className="admin-toast"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.24 }}
            >
              {status}
            </motion.p>
          )}
        </AnimatePresence>

        {isLoading && <SkeletonList />}

        <AnimatePresence mode="wait">
          <motion.div
            className="admin-section-motion"
            key={activeSection}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
        {activeSection === 'dashboard' && (
          <section className="admin-section">
            <div className="admin-summary">
              <div>
                <strong>{dashboard?.services_count ?? services.length}</strong>
                <span>услуг</span>
              </div>
              <div>
                <strong>{dashboard?.leads_count ?? leads.length}</strong>
                <span>заявок всего</span>
              </div>
              <div>
                <strong>{dashboard?.new_leads_count ?? 0}</strong>
                <span>новые заявки</span>
              </div>
              <div>
                <strong>{dashboard?.done_leads_count ?? 0}</strong>
                <span>обработанные</span>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'services' && (
          <section className="admin-section admin-split">
            <form className="admin-panel" onSubmit={submitService}>
              <div className="panel-title">
                <h2>{editingServiceId ? 'Редактировать услугу' : 'Добавить услугу'}</h2>
                {editingServiceId && (
                  <button className="icon-button" type="button" onClick={resetServiceForm}>
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <label>
                Категория
                <select
                  required
                  name="category"
                  value={serviceForm.category}
                  onChange={updateServiceField}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Название
                <input
                  required
                  name="title"
                  value={serviceForm.title}
                  onChange={updateServiceField}
                />
              </label>
              <label>
                Описание
                <textarea
                  required
                  rows="4"
                  name="description"
                  value={serviceForm.description}
                  onChange={updateServiceField}
                />
              </label>
              <div className="form-row">
                <label>
                  Цена
                  <input
                    required
                    type="number"
                    min="0"
                    step="1000"
                    name="base_price"
                    value={serviceForm.base_price}
                    onChange={updateServiceField}
                  />
                </label>
                <label>
                  Длительность
                  <input
                    required
                    name="duration"
                    value={serviceForm.duration}
                    onChange={updateServiceField}
                  />
                </label>
              </div>
              <label className="toggle-line">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={serviceForm.is_active}
                  onChange={updateServiceField}
                />
                Активна
              </label>
              <button className="primary-button" type="submit">
                <Save size={19} />
                {editingServiceId ? 'Сохранить' : 'Добавить услугу'}
              </button>
            </form>

            <div className="admin-panel">
              <h2>Список услуг</h2>
              <div className="admin-list">
                {services.map((service) => (
                  <article className="admin-item" key={service.id}>
                    <div>
                      <strong>{service.title}</strong>
                      <span>
                        {service.category_title || 'Без категории'} ·{' '}
                        {formatPrice(service.base_price)} · {service.duration}
                      </span>
                      {!service.is_active && <em>Не активна</em>}
                    </div>
                    <div className="row-actions">
                      <button className="icon-button" type="button" onClick={() => editService(service)}>
                        <Pencil size={18} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => deleteEntity('service', service.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'categories' && (
          <section className="admin-section admin-split">
            <form className="admin-panel" onSubmit={submitCategory}>
              <div className="panel-title">
                <h2>{editingCategoryId ? 'Редактировать категорию' : 'Добавить категорию'}</h2>
                {editingCategoryId && (
                  <button className="icon-button" type="button" onClick={resetCategoryForm}>
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <label>
                Название
                <input
                  required
                  name="title"
                  value={categoryForm.title}
                  onChange={updateCategoryField}
                />
              </label>
              <label>
                Slug
                <input
                  required
                  name="slug"
                  value={categoryForm.slug}
                  onChange={updateCategoryField}
                />
              </label>
              <div className="form-row">
                <label>
                  Тип
                  <select name="type" value={categoryForm.type} onChange={updateCategoryField}>
                    <option value="main">Основная</option>
                    <option value="additional">Дополнительная</option>
                  </select>
                </label>
                <label>
                  Сортировка
                  <input
                    type="number"
                    name="sort_order"
                    value={categoryForm.sort_order}
                    onChange={updateCategoryField}
                  />
                </label>
              </div>
              <button className="primary-button" type="submit">
                <Save size={19} />
                Сохранить категорию
              </button>
            </form>

            <div className="admin-panel">
              <h2>Категории услуг</h2>
              <div className="admin-list">
                {categories.map((category) => (
                  <article className="admin-item" key={category.id}>
                    <div>
                      <strong>{category.title}</strong>
                      <span>
                        {category.slug} ·{' '}
                        {category.type === 'main' ? 'Основная' : 'Дополнительная'} · #
                        {category.sort_order}
                      </span>
                    </div>
                    <div className="row-actions">
                      <button className="icon-button" type="button" onClick={() => editCategory(category)}>
                        <Pencil size={18} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => deleteEntity('category', category.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'options' && (
          <section className="admin-section admin-split">
            <form className="admin-panel" onSubmit={submitOption}>
              <div className="panel-title">
                <h2>{editingOptionId ? 'Редактировать опцию' : 'Добавить опцию'}</h2>
                {editingOptionId && (
                  <button className="icon-button" type="button" onClick={resetOptionForm}>
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <label>
                Услуга
                <select
                  required
                  name="service"
                  value={optionForm.service}
                  onChange={updateOptionField}
                >
                  <option value="">Выберите услугу</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Название опции
                <input
                  required
                  name="title"
                  value={optionForm.title}
                  onChange={updateOptionField}
                />
              </label>
              <label>
                Цена опции
                <input
                  required
                  type="number"
                  min="0"
                  step="1000"
                  name="extra_price"
                  value={optionForm.extra_price}
                  onChange={updateOptionField}
                />
              </label>
              <label className="toggle-line">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={optionForm.is_active}
                  onChange={updateOptionField}
                />
                Активна
              </label>
              <button className="primary-button" type="submit">
                <Save size={19} />
                Сохранить опцию
              </button>
            </form>

            <div className="admin-panel">
              <h2>Опции услуг</h2>
              <div className="admin-list">
                {options.map((option) => (
                  <article className="admin-item" key={option.id}>
                    <div>
                      <strong>{option.title}</strong>
                      <span>
                        {option.service_title} · +{formatPrice(option.extra_price)}
                      </span>
                      {!option.is_active && <em>Не активна</em>}
                    </div>
                    <div className="row-actions">
                      <button className="icon-button" type="button" onClick={() => editOption(option)}>
                        <Pencil size={18} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => deleteEntity('option', option.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'leads' && (
          <section className="admin-section admin-panel leads-panel">
            <h2>Заявки клиентов</h2>
            <div className="lead-list">
              {leads.map((lead) => (
                <article className={`lead-item ${lead.is_done ? 'done' : ''}`} key={lead.id}>
                  <button
                    className="lead-check"
                    type="button"
                    onClick={() => toggleLeadDone(lead)}
                    aria-label="Отметить заявку"
                  >
                    {lead.is_done ? <Check size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <div className="lead-heading">
                      <strong>{lead.name}</strong>
                      <span>{lead.is_done ? 'Обработана' : 'Новая заявка'}</span>
                    </div>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    <div className="lead-details">
                      <div>
                        <span>Услуга</span>
                        <strong>{lead.service_title || 'Подобрать вместе'}</strong>
                      </div>
                      <div>
                        <span>Опции</span>
                        <strong>
                          {lead.selected_options?.length
                            ? lead.selected_options.map((item) => item.title).join(', ')
                            : 'Без опций'}
                        </strong>
                      </div>
                      <div>
                        <span>Желаемая дата</span>
                        <strong>{formatLeadDate(lead.preferred_date)}</strong>
                      </div>
                      <div>
                        <span>Желаемое время</span>
                        <strong>{formatLeadTime(lead.preferred_time)}</strong>
                      </div>
                      <div>
                        <span>Согласие</span>
                        <strong>{lead.consent ? 'Получено' : 'Нет согласия'}</strong>
                      </div>
                      <div>
                        <span>Создана</span>
                        <strong>{new Date(lead.created_at).toLocaleString('ru-RU')}</strong>
                      </div>
                    </div>
                    <p>
                      <span>Комментарий: </span>
                      {lead.message || 'Комментарий не оставлен.'}
                    </p>
                    <button className="secondary-button" type="button" onClick={() => toggleLeadDone(lead)}>
                      {lead.is_done ? 'Вернуть в новые' : 'Отметить обработанной'}
                    </button>
                  </div>
                </article>
              ))}
              {!leads.length && <p className="empty-state">Заявок пока нет.</p>}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section className="admin-section admin-panel">
            <h2>Настройки</h2>
            <form className="settings-form" onSubmit={saveSettings}>
              <div className="form-row">
                <label>
                  Имя мастера
                  <input
                    name="master_name"
                    value={settingsForm.master_name}
                    onChange={updateSettingsField}
                  />
                </label>
                <label>
                  Телефон
                  <input
                    name="phone"
                    value={settingsForm.phone}
                    onChange={updateSettingsField}
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Telegram
                  <input
                    name="telegram"
                    value={settingsForm.telegram}
                    onChange={updateSettingsField}
                  />
                </label>
                <label>
                  Instagram
                  <input
                    name="instagram"
                    value={settingsForm.instagram}
                    onChange={updateSettingsField}
                  />
                </label>
              </div>
              <label>
                Адрес
                <input
                  name="address"
                  value={settingsForm.address}
                  onChange={updateSettingsField}
                />
              </label>
              <label>
                Ссылка на Яндекс Карты
                <input
                  name="maps_url"
                  value={settingsForm.maps_url}
                  onChange={updateSettingsField}
                />
              </label>
              <button className="primary-button" type="submit">
                <Save size={19} />
                Сохранить настройки
              </button>
            </form>
          </section>
        )}
          </motion.div>
        </AnimatePresence>
    </AdminLayout>
  )
}

export default MasterAdmin
