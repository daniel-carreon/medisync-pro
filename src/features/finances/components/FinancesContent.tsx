'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { KPICard } from '@/shared/components/KPICard'
import { StatusBadge } from '@/shared/components/StatusBadge'
import type { Payment } from '@/types/database'

type PaymentFilter = 'all' | 'paid' | 'pending'

interface PaymentWithDetails extends Payment {
  appointment?: {
    patient?: { first_name: string; last_name: string }
    service?: { name: string }
  }
}

interface Props {
  payments: PaymentWithDetails[]
  todayIncome: number
  weekIncome: number
  monthIncome: number
}

export function FinancesContent({ payments, todayIncome, weekIncome, monthIncome }: Props) {
  const [filter, setFilter] = useState<PaymentFilter>('all')

  const filtered = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Finanzas</h1>
        <p className="mt-1 text-sm text-slate-500">Control de ingresos y pagos</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard
          title="Ingresos Hoy"
          value={`$${todayIncome.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <KPICard
          title="Esta Semana"
          value={`$${weekIncome.toFixed(2)}`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <KPICard
          title="Este Mes"
          value={`$${monthIncome.toFixed(2)}`}
          icon={<Calendar className="h-6 w-6" />}
        />
      </div>

      <div className="flex gap-2">
        {([
          { value: 'all' as const, label: 'Todos' },
          { value: 'paid' as const, label: 'Pagados' },
          { value: 'pending' as const, label: 'Pendientes' },
        ]).map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Metodo</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No hay pagos registrados
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {payment.appointment?.patient?.first_name} {payment.appointment?.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.appointment?.service?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(payment.payment_date).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                      {payment.payment_method || 'Efectivo'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      ${Number(payment.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
