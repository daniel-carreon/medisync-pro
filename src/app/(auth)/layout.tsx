export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-blue-600 lg:px-12">
        <div className="text-white">
          <h1 className="text-4xl font-bold">MediSync Pro</h1>
          <p className="mt-3 text-lg text-blue-100">
            Sistema de Gestion Clinica Inteligente
          </p>
          <ul className="mt-8 space-y-3 text-blue-100">
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Gestion de pacientes centralizada
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Agenda inteligente de citas
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Historial clinico digital
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Control financiero en tiempo real
            </li>
          </ul>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
