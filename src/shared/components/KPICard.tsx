import type { ReactNode } from 'react'

interface Props {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export function KPICard({ title, value, icon, trend }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-emerald-600">{trend}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )
}
