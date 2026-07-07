import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface Props { title: string; value: string | number; icon: LucideIcon; color: string; sub?: string; index?: number }

export default function StatCard({ title, value, icon: Icon, color, sub, index = 0 }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <Card>
        <CardContent className='p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>{title}</p>
              <p className='mt-1 text-3xl font-bold'>{value}</p>
              {sub && <p className='mt-1 text-xs text-muted-foreground'>{sub}</p>}
            </div>
            <div className='p-2.5 rounded-lg' style={{ backgroundColor: `${color}18` }}>
              <Icon className='w-5 h-5' style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
