import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Features from './pages/Features.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Pricing from './pages/Pricing.jsx'
import AppShell from './components/AppShell.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Documents from './pages/Documents.jsx'
import DocumentDetail from './pages/DocumentDetail.jsx'
import Quiz from './pages/Quiz.jsx'
import Flashcards from './pages/Flashcards.jsx'
import History from './pages/History.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/fonctionnalites" element={<Features />} />
          <Route path="/comment-ca-marche" element={<HowItWorks />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/connexion" element={<Login />} />

          {/* App connectée */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />
            <Route path="documents/:id/quiz" element={<Quiz />} />
            <Route path="documents/:id/flashcards" element={<Flashcards />} />
            <Route path="historique" element={<History />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
