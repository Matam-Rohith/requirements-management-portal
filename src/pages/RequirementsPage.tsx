import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import RequirementCard from '@/components/RequirementCard'
import RequirementForm from '@/components/RequirementForm'
import { Requirement } from '@/types'
import { saveRequirements, getRequirements } from '@/lib/store'
import { PRIORITY_ORDER, STATUS_ORDER } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

interface Props { requirements: Requirement[]; isAdmin: boolean; onUpdate: (items: Requirement[]) => void }

export default function RequirementsPage({ requirements, isAdmin, onUpdate }: Props) {
  const [search,         setSearch]  = useState('')
  const [filterStatus,   setFS]      = useState('')
  const [filterPriority, setFP]      = useState('')
  const [editTarget,     setEdit]    = useState<Partial<Requirement> | null>(null)
  const [showForm,       setShowForm] = useState(false)

  const filtered = useMemo(() => requirements.filter(r => {
    if (filterStatus   && r.status   !== filterStatus)   return false
    if (filterPriority && r.priority !== filterPriority) return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false
    }
    return true
  }), [requirements, filterStatus, filterPriority, search])

  const openCreate = () => { setEdit({});  setShowForm(true) }
  const openEdit   = (r: Requirement) => { setEdit(r); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEdit(null) }

  const handleSubmit = (data: Partial<Requirement>) => {
    let updated: Requirement[]
    if (editTarget?.id) {
      updated = requirements.map(r =>
        r.id === editTarget.id ? { ...r, ...data, updated_at: new Date().toISOString() } as Requirement : r
      )
    } else {
      const newReq: Requirement = {
        id: `req-${uuidv4().slice(0, 6)}`,
        title: data.title || '',
        description: data.description || '',
        priority: (data.priority as Requirement['priority']) || 'Medium',
        status: (data.status as Requirement['status']) || 'Open',
        assignee: data.assignee || '',
        tags: data.tags || [],
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      updated = [...requirements, newReq]
    }
    saveRequirements(updated)
    onUpdate(updated)
    closeForm()
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this requirement?')) return
    const updated = requirements.filter(r => r.id !== id)
    saveRequirements(updated)
    onUpdate(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold'>Requirements</h1>
          <p className='text-sm text-muted-foreground'>{filtered.length} of {requirements.length} items</p>
        </div>
        {isAdmin && (
          <Button size='sm' onClick={openCreate} className='gap-1.5'>
            <Plus className='w-4 h-4' />New
          </Button>
        )}
      </div>

      <div className='flex flex-wrap gap-2'>
        <div className='relative flex-1 min-w-48'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search requirements...'
            className='w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring' />
        </div>
        <select value={filterStatus} onChange={e => setFS(e.target.value)}
          className='px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none cursor-pointer'>
          <option value=''>All Status</option>
          {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFP(e.target.value)}
          className='px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none cursor-pointer'>
          <option value=''>All Priority</option>
          {PRIORITY_ORDER.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <div className='text-center py-12 text-muted-foreground text-sm'>No requirements found.</div>
        : <div className='grid gap-3'>{filtered.map((r, i) => (
            <RequirementCard key={r.id} req={r} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} index={i} />
          ))}</div>
      }

      <Dialog open={showForm} onOpenChange={open => !open && closeForm()}>
        {showForm && editTarget !== null && (
          <RequirementForm initial={editTarget} onSubmit={handleSubmit} onClose={closeForm} />
        )}
      </Dialog>
    </div>
  )
}
