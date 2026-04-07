import { useState, useEffect, useCallback } from 'react'
import { Todo, Priority, FilterType } from '../types'

const STORAGE_KEY = 'todo-app-todos'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Todo[]
  } catch {
    return []
  }
}

function saveToStorage(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadFromStorage())
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    saveToStorage(todos)
  }, [todos])

  const addTodo = useCallback((text: string, priority: Priority = 'medium', dueDate: string | null = null) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo: Todo = {
      id: generateId(),
      text: trimmed,
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
      order: Date.now(),
    }
    setTodos(prev => [...prev, newTodo])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate'>>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [])

  const reorderTodos = useCallback((activeId: string, overId: string) => {
    setTodos(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId)
      const newIndex = prev.findIndex(t => t.id === overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      const next = [...prev]
      const [removed] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, removed)
      return next
    })
  }, [])

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    reorderTodos,
  }
}
