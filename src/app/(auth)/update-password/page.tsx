import { UpdatePasswordForm } from '@/features/auth/components'

export default function UpdatePasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Nueva contrasena</h1>
        <p className="mt-2 text-sm text-slate-500">Ingresa tu nueva contrasena</p>
      </div>

      <UpdatePasswordForm />
    </div>
  )
}
