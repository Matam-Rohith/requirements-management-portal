import { useEffect, useState } from 'react'
import { Stats } from '@/types'
import { apiFetch } from '@/lib/utils'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell
} from 'recharts'

const PRI_COLORS: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' }

interface Props { token: string }

export default function AnalyticsPage({ token }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    apiFetch('/stats', {}, token).then(setStats).catch(console.error)
  }, [token])

  if (!stats) return <div className='flex items-center justify-center h-64 text-muted-foreground text-sm'>Loading...</div>

  const priorityData = Object.entries(stats.by_priority).map(([name, value]) => ({ name, value, fill: PRI_COLORS[name] || '#888' }))
  const statusData   = Object.entries(stats.by_status).map(([name, value]) => ({ name, value }))
  const radarData    = [
    ...priorityData.map(d => ({ subject: d.name, count: d.value })),
    ...statusData.map(d => ({ subject: d.name, count: d.value })),
  ]

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-bold'>Analytics</h1>
        <p className='text-sm text-muted-foreground'>Deep dive into requirement metrics</p>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='border rounded-lg p-5 bg-card'>
          <h3 className='text-sm font-semibold mb-4'>Priority Distribution</h3>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey='value' radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 11 }}>
                {priorityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='border rounded-lg p-5 bg-card'>
          <h3 className='text-sm font-semibold mb-4'>Status Overview Radar</h3>
          <ResponsiveContainer width='100%' height={220}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey='subject' tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              <Radar name='Count' dataKey='count' stroke='#3b82f6' fill='#3b82f6' fillOpacity={0.25} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className='border rounded-lg p-5 bg-card md:col-span-2'>
          <h3 className='text-sm font-semibold mb-4'>Status Breakdown</h3>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={statusData} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey='name' type='category' tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey='value' fill='#3b82f6' radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {Object.entries(stats.by_priority).map(([p, v]) => (
          <div key={p} className='border rounded-lg p-4 bg-card text-center'>
            <div className='text-2xl font-bold' style={{ color: PRI_COLORS[p] }}>{v}</div>
            <div className='text-xs text-muted-foreground mt-1'>{p} Priority</div>
          </div>
        ))}
      </div>
    </div>
  )
}
