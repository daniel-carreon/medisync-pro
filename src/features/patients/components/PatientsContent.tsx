'use client'

import { useState } from 'react'
import { Search, Plus, User } from 'lucide-react'
import type { Patient } from '@/types/database'
import { PatientForm } from './PatientForm'
import Link from 'next/link'

interface Props {
  patients: Patient[]
}

export function PatientsContent({ patients }: Props) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">{patients.length} pacientes registrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Paciente
        </button>
      </div>

      {showForm && <PatientForm onClose={() => setShowForm(false)} />}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Genero</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Alergias</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                    No se encontraron pacientes
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{patient.first_name} {patient.last_name}</p>
                          {patient.date_of_birth && (
                            <p className="text-xs text-slate-500">
                              {new Date(patient.date_of_birth).toLocaleDateString('es-MX')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{patient.phone || '-'}</p>
                      <p className="text-xs text-slate-400">{patient.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.gender || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.allergies || 'Ninguna'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Ver Detalle
                      </Link>
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
