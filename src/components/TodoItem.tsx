import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, GripVertical, Calendar } from 'lucide-react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import { Todo, Priority } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate'>>) => void
}

const priorityConfig: Record<Priority, { dot: string; border: string; label: string; labelColor: string }> = {
  low: {
    dot: 'bg-green-400',
    border: 'border-l-green-400',
    label: 'Low',
    labelColor: 'text-green-400',
  },
  medium: {
    dot: 'bg-yellow-400',
    border: 'border-l-yellow-400',
    label: 'Medium',
    labelColor: 'text-yellow-400',
  },
  high: {
    dot: 'bg-red-400',
    border: 'border-l-red-400',
    label: 'High',
    labelColor: 'text-red-400',
  },
}

function formatDueDate(dateStr: string): { text: string; color: string } {
  const date = parseISO(dateStr)
  if (isToday(date)) return { text: 'Today', color: 'text-yellow-400' }
  if (isTomorrow(date)) return { text: 'Tomorrow', color: 'text-blue-400' }
  if (isPast(date)) return { text: format(date, 'MMM d'), color: 'text-red-400' }
  return { text: format(date, 'MMM d'), color: 'text-slate-400' }
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function startEdit() {
    if (todo.completed) return
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate || '')
    setIsEditing(true)
  }

  function commitEdit() {
    const trimmed = editText.trim()
    if (trimmed) {
      onUpdate(todo.id, {
        text: trimmed,
        priority: editPriority,
        dueDate: editDueDate || null,
      })
    }
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate || '')
    setIsEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const pConfig = priorityConfig[todo.priority]
  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 border-l-2 ${pConfig.border} transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-[1.02] shadow-2xl shadow-black/40 z-50' : 'hover:bg-slate-800/80'
      } ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="drag-handle flex-shrink-0 mt-0.5 text-slate-600 hover:text-slate-400 transition-colors duration-150 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Checkbox */}
      <div className="flex-shrink-0 mt-0.5">
        <label className="cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-violet-500 border-violet-500'
                : 'border-slate-500 hover:border-violet-400'
            }`}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </label>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              className="w-full bg-slate-700/60 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/70 border border-slate-600/40 focus:border-violet-500/50 transition-all"
            />
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onMouseDown={e => { e.preventDefault(); setEditPriority(p) }}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-all border ${
                      editPriority === p
                        ? `bg-slate-600 border-slate-500 ${priorityConfig[p].labelColor}`
                        : 'bg-slate-700/40 border-slate-700/60 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={editDueDate}
                onMouseDown={e => e.stopPropagation()}
                onChange={e => setEditDueDate(e.target.value)}
                onBlur={e => e.stopPropagation()}
                className="bg-slate-700/40 border border-slate-700/60 text-slate-300 rounded px-2 py-0.5 text-xs outline-none focus:ring-1 focus:ring-violet-500/50 [color-scheme:dark]"
              />
              <span className="text-slate-500 text-xs ml-auto">Enter to save · Esc to cancel</span>
            </div>
          </div>
        ) : (
          <>
            <p
              onDoubleClick={startEdit}
              className={`text-sm leading-relaxed break-words cursor-text select-none ${
                todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
              }`}
              title="Double-click to edit"
            >
              {todo.text}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`flex items-center gap-1 text-xs ${pConfig.labelColor}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
                {pConfig.label}
              </span>
              {dueDateInfo && (
                <span className={`flex items-center gap-1 text-xs ${dueDateInfo.color}`}>
                  <Calendar className="w-3 h-3" />
                  {dueDateInfo.text}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 mt-0.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
        aria-label="Delete todo"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
