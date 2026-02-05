'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createAppointment } from '@/actions/appointments'
import type { Patient, Service } from '@/types/database'

interface Props {
  patients: Pick<Patient, 'id' | 'first_name' | 'last_name'>[]
  services: Service[]
  onClose: () => void
}

export function AppointmentForm({ patients, services, onClose }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await createAppointment(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Nueva Cita</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form action={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Paciente *</label>
          <select name="patient_id" required className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Seleccionar paciente</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Servicio *</label>
          <select
            name="service_id"
            required
            onChange={(e) => {
              const svc = services.find(s => s.id === e.target.value)
              setSelectedService(svc || null)
            }}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} - ${Number(s.price).toFixed(2)}</option>
            ))}
          </select>
          {selectedService && (
            <p className="mt-1 text-xs text-slate-500">
              Duracion: {selectedService.duration_minutes} min | Precio: ${Number(selectedService.price).toFixed(2)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fecha y Hora *</label>
          <input name="start_time" type="datetime-local" required className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Notas</label>
          <input name="notes" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Notas adicionales..." />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 md:col-span-2">{error}</div>
        )}

        <div className="flex gap-3 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear Cita'}
          </button>
        </div>
      </form>
    </div>
  )
}
