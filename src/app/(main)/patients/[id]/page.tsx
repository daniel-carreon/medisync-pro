import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PatientDetail } from '@/features/patients/components/PatientDetail'

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('doctor_id', user.id)
    .single()

  if (!patient) notFound()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, service:services(*), medical_note:medical_notes(*), payment:payments(*)')
    .eq('patient_id', id)
    .eq('doctor_id', user.id)
    .order('start_time', { ascending: false })

  return <PatientDetail patient={patient} appointments={appointments || []} />
}
