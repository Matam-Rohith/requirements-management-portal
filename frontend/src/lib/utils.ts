import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(path: string, options: RequestInit = {}, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High:     'bg-orange-100 text-orange-700 border-orange-200',
  Medium:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low:      'bg-green-100 text-green-700 border-green-200',
}

export const STATUS_COLORS: Record<string, string> = {
  'Open':        'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Done':        'bg-green-100 text-green-700 border-green-200',
  'Closed':      'bg-gray-100 text-gray-500 border-gray-200',
}

export const PRIORITY_ORDER = ['Critical', 'High', 'Medium', 'Low']
export const STATUS_ORDER = ['Open', 'In Progress', 'Done', 'Closed']
