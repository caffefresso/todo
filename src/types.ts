export type Priority = 'low' | 'medium' | 'high'

export type FilterType = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate: string | null // ISO date string or null
  createdAt: string // ISO timestamp
  order: number
}
