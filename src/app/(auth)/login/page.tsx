import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido a MediSync</h1>
        <p className="mt-2 text-sm text-slate-500">Inicia sesion en tu cuenta</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-slate-500">
        No tienes cuenta?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}
