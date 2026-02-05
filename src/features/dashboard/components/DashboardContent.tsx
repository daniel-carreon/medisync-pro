'use client'

import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { KPICard } from '@/shared/components/KPICard'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { RevenueChart } from './RevenueChart'
import Link from 'next/link'
import type { Appointment } from '@/types/database'

interface Props {
  totalPatients: number
  todayAppointments: number
  monthIncome: number
  completionRate: number
  upcomingAppointments: (Appointment & { patient: { first_name: string; last_name: string }; service: { name: string } })[]
  weeklyRevenue: { day: string; amount: number }[]
}

export function DashboardContent({
  totalPatients,
  todayAppointments,
  monthIncome,
  completionRate,
  upcomingAppointments,
  weeklyRevenue,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Panel Principal</h1>
        <p className="mt-1 text-sm text-slate-500">Resumen de tu clinica</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pacientes Totales"
          value={totalPatients}
          icon={<Users className="h-6 w-6" />}
        />
        <KPICard
          title="Citas Hoy"
          value={todayAppointments}
          icon={<Calendar className="h-6 w-6" />}
        />
        <KPICard
          title="Ingresos del Mes"
          value={`$${monthIncome.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <KPICard
          title="Tasa Completadas"
          value={`${completionRate}%`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Ingresos - Ultimos 7 dias</h3>
          <div className="mt-4 h-64">
            <RevenueChart data={weeklyRevenue} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Proximas Citas</h3>
            <Link href="/calendar" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {upcomingAppointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No hay citas programadas</p>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {apt.patient?.first_name} {apt.patient?.last_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {apt.service?.name} - {new Date(apt.start_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    <Link
                      href={`/appointments/${apt.id}`}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
