import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import RequirementCard from '@/components/RequirementCard'
import RequirementForm from '@/components/RequirementForm'
import { Requirement } from '@/types'
import { apiFetch, PRIORITY_ORDER, STATUS_ORDER } from '@/lib/utils'

interface Props { token: string; isAdmin: boolean }

export default function RequirementsPage({ token, isAdmin }: Props) {
  const [items, setItems]       = useState<Requirement[]>([])
  const [loading, setLoading]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFS]   = useState('')
  const [filterPriority, setFP] = useState('')
  const [editTarget, setEdit]   = useState<Partial<Requirement> | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterStatus) params.set('status', filterStatus)
      if (filterPriority) params.set('priority', filterPriority)
      const data = await apiFetch(`/requirements?${params}`, {}, token)
      setItems(data.items)
    } finally { setLoading(false) }
  }, [token, search, filterStatus, filterPriority])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEdit({}); setShowForm(true) }
  const openEdit   = (r: Requirement) => { setEdit(r); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEdit(null) }

  const handleSubmit = async (data: Partial<Requirement>) => {
    setSaving(true)
    try {
      if (editTarget?.id) {
        await apiFetch(`/requirements/${editTarget.id}`, { method: 'PUT', body: JSON.stringify(data) }, token)
      } else {
        await apiFetch('/requirements', { method: 'POST', body: JSON.stringify(data) }, token)
      }
      closeForm(); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this requirement?')) return
    await apiFetch(`/requirements/${id}`, { method: 'DELETE' }, token)
    load()
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold'>Requirements</h1>
          <p className='text-sm text-muted-foreground'>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {isAdmin && <Button size='sm' onClick={openCreate} className='gap-1.5'><Plus className='w-4 h-4' />New</Button>}
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <div className='relative flex-1 min-w-48'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search requirements...'
            className='w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring' />
        </div>
        <select value={filterStatus} onChange={e => setFS(e.target.value)}
          className='px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer'>
          <option value=''>All Status</option>
          {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFP(e.target.value)}
          className='px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer'>
          <option value=''>All Priority</option>
          {PRIORITY_ORDER.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <div className='text-center py-12 text-muted-foreground text-sm'>Loading...</div>
      ) : items.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground text-sm'>No requirements found.</div>
      ) : (
        <div className='grid gap-3'>
          {items.map((r, i) => (
            <RequirementCard key={r.id} req={r} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} index={i} />
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={open => !open && closeForm()}>
        {showForm && editTarget !== null && (
          <RequirementForm initial={editTarget} onSubmit={handleSubmit} onClose={closeForm} loading={saving} />
        )}
      </Dialog>
    </div>
  )
}
