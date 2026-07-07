import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Requirement } from '@/types'
import { PRIORITY_ORDER, STATUS_ORDER } from '@/lib/utils'

interface Props { initial?: Partial<Requirement>; onSubmit: (data: Partial<Requirement>) => void; onClose: () => void; loading?: boolean }

export default function RequirementForm({ initial, onSubmit, onClose, loading }: Props) {
  const [form, setForm] = useState({
    title:       initial?.title       || '',
    description: initial?.description || '',
    priority:    initial?.priority    || 'Medium',
    status:      initial?.status      || 'Open',
    assignee:    initial?.assignee    || '',
    tags:        initial?.tags?.join(', ') || '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
  }

  const field = 'w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <DialogContent className='max-w-md'>
      <DialogHeader><DialogTitle>{initial?.id ? 'Edit Requirement' : 'New Requirement'}</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-3 mt-2'>
        <div>
          <label className='text-xs font-medium text-muted-foreground mb-1 block'>Title *</label>
          <input className={field} value={form.title} onChange={e => set('title', e.target.value)} required placeholder='Short requirement title' />
        </div>
        <div>
          <label className='text-xs font-medium text-muted-foreground mb-1 block'>Description *</label>
          <textarea className={`${field} min-h-[80px] resize-none`} value={form.description} onChange={e => set('description', e.target.value)} required />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='text-xs font-medium text-muted-foreground mb-1 block'>Priority</label>
            <select className={field} value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITY_ORDER.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className='text-xs font-medium text-muted-foreground mb-1 block'>Status</label>
            <select className={field} value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className='text-xs font-medium text-muted-foreground mb-1 block'>Assignee</label>
          <input className={field} value={form.assignee} onChange={e => set('assignee', e.target.value)} placeholder='username' />
        </div>
        <div>
          <label className='text-xs font-medium text-muted-foreground mb-1 block'>Tags (comma-separated)</label>
          <input className={field} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder='auth, security' />
        </div>
        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='outline' size='sm' onClick={onClose}>Cancel</Button>
          <Button type='submit' size='sm' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </DialogContent>
  )
}
