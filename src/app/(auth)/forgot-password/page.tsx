import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/components'

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Recuperar contrasena</h1>
        <p className="mt-2 text-sm text-slate-500">Te enviaremos un enlace de recuperacion</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-slate-500">
        <Link href="/login" className="text-blue-600 hover:underline">
          Volver al login
        </Link>
      </p>
    </div>
  )
}
