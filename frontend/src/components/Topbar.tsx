import { LogOut, User, ClipboardList, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { User as UserType } from '@/types'
import { useState } from 'react'

interface Props {
  user: UserType
  onLogout: () => void
}

export default function Topbar({ user, onLogout }: Props) {
  const [dark, setDark] = useState(false)

  const toggleDark = () => {
    setDark(d => !d)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur'>
      <div className='flex h-14 items-center justify-between px-6'>
        <div className='flex items-center gap-2'>
          <ClipboardList className='w-5 h-5 text-primary' />
          <span className='font-bold text-base'>Requirements Portal</span>
          <span className='hidden md:inline-block ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium'>v1.0</span>
        </div>
        <div className='flex items-center gap-3'>
          <button onClick={toggleDark} className='p-2 rounded-md hover:bg-accent transition-colors'>
            {dark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
          </button>
          <div className='flex items-center gap-2 text-sm'>
            <div className='p-1.5 rounded-full bg-primary/10'><User className='w-3.5 h-3.5 text-primary' /></div>
            <span className='hidden sm:block font-medium'>{user.full_name}</span>
            <span className='text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full'>{user.role}</span>
          </div>
          <Button variant='ghost' size='sm' onClick={onLogout} className='gap-1.5 text-muted-foreground hover:text-foreground'>
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:block'>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
