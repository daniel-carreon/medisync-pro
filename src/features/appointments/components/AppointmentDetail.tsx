'use client'

import { useState } from 'react'
import { ArrowLeft, User, Stethoscope, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { completeAppointment, updateAppointmentStatus } from '@/actions/appointments'
import type { Appointment, Patient, Service, MedicalNote, Payment } from '@/types/database'

interface Props {
  appointment: Appointment & {
    patient: Patient
    service: Service
    medical_note: MedicalNote[]
    payment: Payment[]
  }
}

export function AppointmentDetail({ appointment }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCompleted = appointment.status === 'completed'
  const existingNote = appointment.medical_note?.[0]
  const existingPayment = appointment.payment?.[0]

  async function handleComplete(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await completeAppointment(appointment.id, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleStatusChange(status: string) {
    await updateAppointmentStatus(appointment.id, status)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/calendar" className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Consulta</h1>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-sm text-slate-500">
            {new Date(appointment.start_time).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' '}{new Date(appointment.start_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {!isCompleted && appointment.status !== 'cancelled' && (
          <div className="flex gap-2">
            {appointment.status === 'pending' && (
              <button
                onClick={() => handleStatusChange('confirmed')}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Confirmar
              </button>
            )}
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Paciente</h3>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium text-slate-900">{appointment.patient?.first_name} {appointment.patient?.last_name}</p>
            {appointment.patient?.phone && <p className="text-slate-500">Tel: {appointment.patient.phone}</p>}
            {appointment.patient?.email && <p className="text-slate-500">{appointment.patient.email}</p>}
            {appointment.patient?.allergies && (
              <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-600">
                Alergias: {appointment.patient.allergies}
              </p>
            )}
          </div>
        </div>

        {/* Service Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Servicio</h3>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium text-slate-900">{appointment.service?.name}</p>
            <p className="text-slate-500">Duracion: {appointment.service?.duration_minutes} min</p>
            <p className="text-lg font-semibold text-emerald-600">${Number(appointment.service?.price).toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Pago</h3>
          </div>
          <div className="mt-4 text-sm">
            {existingPayment ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-emerald-600">${Number(existingPayment.amount).toFixed(2)}</p>
                <StatusBadge status={existingPayment.status} />
                <p className="text-slate-500">Metodo: {existingPayment.payment_method || 'Efectivo'}</p>
              </div>
            ) : (
              <p className="text-slate-400">Sin pago registrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Note / Complete Form */}
      {isCompleted && existingNote ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Nota Medica</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Diagnostico</p>
              <p className="mt-1 text-sm text-slate-600">{existingNote.diagnosis}</p>
            </div>
            {existingNote.prescription && (
              <div>
                <p className="text-sm font-medium text-slate-700">Receta</p>
                <p className="mt-1 text-sm text-slate-600">{existingNote.prescription}</p>
              </div>
            )}
            {existingNote.private_notes && (
              <div>
                <p className="text-sm font-medium text-slate-700">Notas Privadas</p>
                <p className="mt-1 text-sm text-slate-600">{existingNote.private_notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : !isCompleted && appointment.status !== 'cancelled' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Completar Consulta</h3>
          <form action={handleComplete} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Diagnostico *</label>
              <textarea name="diagnosis" required rows={3} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describir el diagnostico..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Receta</label>
              <textarea name="prescription" rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Medicamentos y dosis..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Notas Privadas</label>
              <textarea name="private_notes" rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Solo visibles para el doctor..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Metodo de Pago</label>
              <select name="payment_method" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Completando...' : 'Completar Cita y Registrar Pago'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
