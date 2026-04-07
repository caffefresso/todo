import { FilterType } from '../types'

interface Props {
  filter: FilterType
  onFilter: (f: FilterType) => void
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
}

const tabs: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function FilterBar({ filter, onFilter, activeCount, completedCount, onClearCompleted }: Props) {
  return (
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => onFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              filter === tab.value
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm">
          <span className="text-white font-semibold">{activeCount}</span> item{activeCount !== 1 ? 's' : ''} left
        </span>
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-slate-400 hover:text-red-400 text-sm transition-colors duration-150"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  )
}
