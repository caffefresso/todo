import { useState, KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'
import { Priority } from '../types'

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string | null) => void
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
]

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  function handleAdd() {
    if (!text.trim()) return
    onAdd(text, priority, dueDate || null)
    setText('')
    setDueDate('')
    setPriority('medium')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 mb-4 border border-slate-700/50">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/70 transition-all border border-slate-600/40 focus:border-violet-500/50"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <div className="flex gap-3 flex-wrap">
        {/* Priority selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Priority</span>
          <div className="flex gap-1">
            {priorityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 border ${
                  priority === opt.value
                    ? `bg-slate-600 border-slate-500 ${opt.color}`
                    : 'bg-slate-700/40 border-slate-700/60 text-slate-500 hover:text-slate-300 hover:bg-slate-700/70'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Due</span>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="bg-slate-700/40 border border-slate-700/60 text-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  )
}
