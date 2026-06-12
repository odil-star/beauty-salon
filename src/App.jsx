import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import MobileConversionCta from './components/MobileConversionCta'

const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Home = lazy(() => import('./pages/Home'))
const MasterAdmin = lazy(() => import('./pages/MasterAdmin'))
const Services = lazy(() => import('./pages/Services'))
const Works = lazy(() => import('./pages/Works'))

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/master-admin')

  return (
    <div className={`app-shell ${isAdminPage ? 'admin-app-shell' : 'public-app-shell'}`}>
      {!isAdminPage && <Header />}
      <Suspense fallback={<main className="route-loading"><div className="state-line">Загрузка...</div></main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/works" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/master-admin/*" element={<MasterAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <MobileConversionCta />}
    </div>
  )
}

export default App
