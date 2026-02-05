'use client'

import { ArrowLeft, User, Phone, Mail, AlertTriangle, Calendar } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/shared/components/StatusBadge'
import type { Patient, Appointment } from '@/types/database'

interface Props {
  patient: Patient
  appointments: Appointment[]
}

export function PatientDetail({ patient, appointments }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients" className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{patient.first_name} {patient.last_name}</h1>
          <p className="text-sm text-slate-500">Detalle del paciente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{patient.first_name} {patient.last_name}</p>
              <p className="text-xs text-slate-500">{patient.gender || 'No especificado'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {patient.date_of_birth && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                {new Date(patient.date_of_birth).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {patient.phone}
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {patient.email}
              </div>
            )}
            {patient.allergies && (
              <div className="flex items-start gap-2 text-sm text-red-600">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>Alergias: {patient.allergies}</span>
              </div>
            )}
          </div>

          {patient.notes && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Notas:</p>
              <p className="mt-1">{patient.notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="font-semibold text-slate-900">Historial de Citas ({appointments.length})</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {appointments.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-slate-400">Sin citas registradas</p>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {apt.service?.name || 'Servicio'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(apt.start_time).toLocaleDateString('es-MX', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          {' '}{new Date(apt.start_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
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
                    {apt.medical_note && Array.isArray(apt.medical_note) && apt.medical_note.length > 0 && (
                      <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                        <span className="font-medium">Diagnostico:</span> {apt.medical_note[0].diagnosis}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
