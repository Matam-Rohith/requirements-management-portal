import { useEffect, useState } from 'react'
import { ClipboardList, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import StatCard from '@/components/StatCard'
import { Stats } from '@/types'
import { apiFetch } from '@/lib/utils'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6b7280']
const PRI_COLORS: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' }

interface Props { token: string }

export default function DashboardPage({ token }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    apiFetch('/stats', {}, token).then(setStats).catch(console.error)
  }, [token])

  if (!stats) return <div className='flex items-center justify-center h-64 text-muted-foreground text-sm'>Loading...</div>

  const statusData  = Object.entries(stats.by_status).map(([name, value]) => ({ name, value }))
  const priorityData = Object.entries(stats.by_priority).map(([name, value]) => ({ name, value, fill: PRI_COLORS[name] || '#888' }))

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-bold'>Dashboard</h1>
        <p className='text-sm text-muted-foreground'>Overview of all requirements</p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatCard title='Total'      value={stats.total}                              icon={ClipboardList}  color='#3b82f6' index={0} />
        <StatCard title='Done'       value={stats.by_status['Done'] || 0}             icon={CheckCircle}    color='#10b981' index={1} />
        <StatCard title='In Progress' value={stats.by_status['In Progress'] || 0}    icon={Clock}          color='#f59e0b' index={2} />
        <StatCard title='Completion' value={`${stats.completion_rate}%`}              icon={TrendingUp}     color='#8b5cf6' sub='completion rate' index={3} />
      </div>

      {(stats.by_status['Critical'] || stats.by_priority['Critical']) > 0 && (
        <div className='flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'>
          <AlertTriangle className='w-4 h-4 flex-shrink-0' />
          <span><strong>{stats.by_priority['Critical'] || 0}</strong> critical requirements need immediate attention.</span>
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='border rounded-lg p-5 bg-card'>
          <h3 className='text-sm font-semibold mb-4'>Status Distribution</h3>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie data={statusData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={85}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='border rounded-lg p-5 bg-card'>
          <h3 className='text-sm font-semibold mb-4'>Priority Breakdown</h3>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey='value' radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
