import { Requirement, User } from '@/types'

// ── Hardcoded users ──────────────────────────────────────────
export const USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: { username: 'admin', full_name: 'Admin User', role: 'admin' },
  },
  viewer: {
    password: 'viewer123',
    user: { username: 'viewer', full_name: 'Viewer User', role: 'viewer' },
  },
}

// ── Seed data ────────────────────────────────────────────────
const SEED: Requirement[] = [
  { id: 'req-001', title: 'User Authentication Module',  description: 'Implement JWT-based login and session management for all user roles.', priority: 'Critical', status: 'Done',        assignee: 'admin',  created_by: 'admin',  created_at: '2024-03-01T09:00:00', updated_at: '2024-03-10T15:00:00', tags: ['auth', 'security'] },
  { id: 'req-002', title: 'Requirements Dashboard',      description: 'Build a real-time dashboard showing stats, progress charts, and recent activity.', priority: 'High',     status: 'In Progress', assignee: 'viewer', created_by: 'admin',  created_at: '2024-03-02T10:00:00', updated_at: '2024-03-12T11:00:00', tags: ['dashboard', 'charts'] },
  { id: 'req-003', title: 'Export to PDF/CSV',           description: 'Allow users to export requirements list as PDF or CSV for reporting.', priority: 'Medium',   status: 'Open',        assignee: 'admin',  created_by: 'viewer', created_at: '2024-03-05T08:00:00', updated_at: '2024-03-05T08:00:00', tags: ['export', 'reporting'] },
  { id: 'req-004', title: 'Email Notifications',         description: 'Send email alerts when requirement status changes or new requirements are assigned.', priority: 'Low',      status: 'Open',        assignee: 'viewer', created_by: 'admin',  created_at: '2024-03-06T14:00:00', updated_at: '2024-03-06T14:00:00', tags: ['notifications'] },
  { id: 'req-005', title: 'Audit Trail',                  description: 'Log all changes to requirements with timestamp and user info for compliance.', priority: 'Critical', status: 'In Progress', assignee: 'admin',  created_by: 'admin',  created_at: '2024-03-07T09:30:00', updated_at: '2024-03-13T10:00:00', tags: ['audit', 'compliance'] },
]

const KEY = 'rmp_requirements'

export function getRequirements(): Requirement[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : SEED
  } catch { return SEED }
}

export function saveRequirements(items: Requirement[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function computeStats(items: Requirement[]) {
  const by_status: Record<string, number>   = {}
  const by_priority: Record<string, number> = {}
  for (const r of items) {
    by_status[r.status]     = (by_status[r.status]     || 0) + 1
    by_priority[r.priority] = (by_priority[r.priority] || 0) + 1
  }
  const done = by_status['Done'] || 0
  return {
    total: items.length,
    by_status,
    by_priority,
    completion_rate: items.length ? Math.round((done / items.length) * 100) : 0,
  }
}
