import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Revisa tu correo</h1>
      <p className="text-sm text-slate-500">
        Te enviamos un enlace de confirmacion. Revisa tu bandeja de entrada.
      </p>
      <Link
        href="/login"
        className="inline-block text-sm text-blue-600 hover:underline"
      >
        Volver al login
      </Link>
    </div>
  )
}
