'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { AppointmentForm } from './AppointmentForm'
import { updateAppointmentStatus } from '@/actions/appointments'
import Link from 'next/link'
import type { Appointment, Patient, Service } from '@/types/database'

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface Props {
  appointments: (Appointment & { patient: Patient; service: Service })[]
  patients: Pick<Patient, 'id' | 'first_name' | 'last_name'>[]
  services: Service[]
}

export function CalendarContent({ appointments, patients, services }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' },
  ]

  async function handleStatusChange(id: string, status: string) {
    await updateAppointmentStatus(id, status)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agenda</h1>
          <p className="mt-1 text-sm text-slate-500">{appointments.length} citas en total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva Cita
        </button>
      </div>

      {showForm && (
        <AppointmentForm
          patients={patients}
          services={services}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="flex gap-2">
        {filters.map(f => (
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

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-400">No hay citas con este filtro</p>
          </div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <span className="text-xs font-medium">
                      {new Date(apt.start_time).toLocaleDateString('es-MX', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(apt.start_time).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {apt.patient?.first_name} {apt.patient?.last_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {new Date(apt.start_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(apt.end_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-slate-300">|</span>
                      {apt.service?.name}
                      <span className="text-slate-300">|</span>
                      ${Number(apt.service?.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      Confirmar
                    </button>
                  )}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <>
                      <Link
                        href={`/appointments/${apt.id}`}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Atender
                      </Link>
                      <button
                        onClick={() => handleStatusChange(apt.id, 'cancelled')}
                        className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
