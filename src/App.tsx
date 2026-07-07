import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import RequirementsPage from '@/pages/RequirementsPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'

type Page = 'dashboard' | 'requirements' | 'analytics'

export default function App() {
  const { token, user, loading, error, login, logout, isAdmin } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')

  if (!token || !user) {
    return <LoginPage onLogin={login} loading={loading} error={error} />
  }

  return (
    <div className='min-h-screen bg-background'>
      <Topbar user={user} onLogout={logout} />
      <div className='flex'>
        <Sidebar active={page} onChange={p => setPage(p as Page)} />
        <main className='flex-1 overflow-auto'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 py-6'>
            <AnimatePresence mode='wait'>
              <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                {page === 'dashboard'    && <DashboardPage    token={token} />}
                {page === 'requirements' && <RequirementsPage token={token} isAdmin={isAdmin} />}
                {page === 'analytics'   && <AnalyticsPage    token={token} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
