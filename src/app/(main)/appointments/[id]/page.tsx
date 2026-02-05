import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AppointmentDetail } from '@/features/appointments/components/AppointmentDetail'

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: appointment } = await supabase
    .from('appointments')
    .select('*, patient:patients(*), service:services(*), medical_note:medical_notes(*), payment:payments(*)')
    .eq('id', id)
    .eq('doctor_id', user.id)
    .single()

  if (!appointment) notFound()

  return <AppointmentDetail appointment={appointment} />
}
