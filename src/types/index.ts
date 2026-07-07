export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type Status = 'Open' | 'In Progress' | 'Done' | 'Closed'

export interface Requirement {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  assignee: string
  created_by: string
  created_at: string
  updated_at: string
  tags: string[]
}

export interface User {
  username: string
  full_name: string
  role: 'admin' | 'viewer'
}

export interface Stats {
  total: number
  by_status: Record<string, number>
  by_priority: Record<string, number>
  completion_rate: number
}
