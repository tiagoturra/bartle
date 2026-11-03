import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BartlePage } from '../modules/bartle/pages/BartlePage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BartlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
