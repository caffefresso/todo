import { CheckSquare } from 'lucide-react'

export function Header() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 bg-violet-500 rounded-xl">
        <CheckSquare className="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Todos</h1>
        <p className="text-slate-400 text-sm">Stay organized and productive</p>
      </div>
    </div>
  )
}
