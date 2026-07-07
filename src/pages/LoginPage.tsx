import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props { onLogin: (u: string, p: string) => Promise<boolean>; loading: boolean; error: string | null }

export default function LoginPage({ onLogin, loading, error }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const submit = async (e: React.FormEvent) => { e.preventDefault(); await onLogin(username, password) }
  const field = 'w-full pl-9 pr-4 py-2.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-4'>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-sm bg-card border rounded-xl shadow-lg p-8'>
        <div className='flex flex-col items-center mb-6'>
          <div className='p-3 rounded-full bg-primary/10 mb-3'><ClipboardList className='w-7 h-7 text-primary' /></div>
          <h1 className='text-xl font-bold'>Requirements Portal</h1>
          <p className='text-sm text-muted-foreground mt-1'>Sign in to your account</p>
        </div>
        {error && (
          <div className='mb-4 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm'>{error}</div>
        )}
        <form onSubmit={submit} className='space-y-4'>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input className={field} placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input className={`${field} pr-10`} type={showPw ? 'text' : 'password'} placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
            <button type='button' onClick={() => setShowPw(s => !s)} className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
              {showPw ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <div className='mt-5 p-3 rounded-md bg-muted text-xs text-muted-foreground space-y-1'>
          <p className='font-medium text-foreground mb-1'>Demo Credentials</p>
          <p>👤 <span className='font-mono'>admin</span> / <span className='font-mono'>admin123</span> (Admin)</p>
          <p>👁️ <span className='font-mono'>viewer</span> / <span className='font-mono'>viewer123</span> (Viewer)</p>
        </div>
      </motion.div>
    </div>
  )
}
