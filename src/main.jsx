import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './login.jsx'
import LoginPage from './login.jsx'
import RegisterPage from './register.jsx'
import SleepSyncMenu from './menu.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<SleepSyncMenu />} />
      </Routes>
    </Router>
  </StrictMode>,
)
