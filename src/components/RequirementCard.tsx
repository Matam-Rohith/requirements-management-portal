import { motion } from 'framer-motion'
import { Pencil, Trash2, Tag, User, Calendar } from 'lucide-react'
import { Requirement } from '@/types'
import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props { req: Requirement; isAdmin: boolean; onEdit: (r: Requirement) => void; onDelete: (id: string) => void; index?: number }

export default function RequirementCard({ req, isAdmin, onEdit, onDelete, index = 0 }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className='bg-card border rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap mb-1'>
            <span className='text-xs font-mono text-muted-foreground'>{req.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[req.priority]}`}>{req.priority}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[req.status]}`}>{req.status}</span>
          </div>
          <h3 className='font-semibold text-sm mb-1 truncate'>{req.title}</h3>
          <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>{req.description}</p>
          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'><User className='w-3 h-3' />{req.assignee}</span>
            <span className='flex items-center gap-1'><Calendar className='w-3 h-3' />{req.updated_at.substring(0, 10)}</span>
            {req.tags.length > 0 && (
              <span className='flex items-center gap-1'><Tag className='w-3 h-3' />
                {req.tags.slice(0, 2).map(t => <span key={t} className='bg-muted px-1.5 py-0.5 rounded text-[10px]'>{t}</span>)}
              </span>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className='flex gap-1 flex-shrink-0'>
            <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onEdit(req)}><Pencil className='w-3.5 h-3.5' /></Button>
            <Button variant='ghost' size='icon' className='h-7 w-7 text-destructive hover:text-destructive' onClick={() => onDelete(req.id)}><Trash2 className='w-3.5 h-3.5' /></Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
