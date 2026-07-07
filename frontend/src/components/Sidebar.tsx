import { LayoutDashboard, ClipboardList, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'requirements', label: 'Requirements', icon: ClipboardList },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
]

interface Props { active: string; onChange: (id: string) => void }

export default function Sidebar({ active, onChange }: Props) {
  return (
    <aside className='hidden md:flex flex-col w-52 min-h-[calc(100vh-3.5rem)] border-r bg-background pt-4'>
      <nav className='px-3 space-y-1'>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              active === id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className='w-4 h-4 flex-shrink-0' />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
