import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediSync Pro - Sistema de Gestion Clinica',
  description: 'Sistema de gestion clinica inteligente para doctores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  )
}
