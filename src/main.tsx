import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The application root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
