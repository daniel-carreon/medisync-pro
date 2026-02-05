'use client'

import { LogOut } from 'lucide-react'
import { signout } from '@/actions/auth'
import { useAuth } from '@/hooks/useAuth'

export function AppHeader() {
  const { profile } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      <div className="lg:ml-0 ml-12">
        <h2 className="text-sm font-medium text-slate-900">
          {profile?.full_name || profile?.email || 'Doctor'}
        </h2>
      </div>
      <form action={signout}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </form>
    </header>
  )
}
