import { createClient } from '@/lib/supabase/server'
import { CalendarContent } from '@/features/appointments/components/CalendarContent'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [appointmentsRes, patientsRes, servicesRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, patient:patients(*), service:services(*)')
      .eq('doctor_id', user.id)
      .order('start_time', { ascending: true }),
    supabase.from('patients').select('id, first_name, last_name').eq('doctor_id', user.id).order('first_name'),
    supabase.from('services').select('*').eq('doctor_id', user.id).order('name'),
  ])

  return (
    <CalendarContent
      appointments={appointmentsRes.data || []}
      patients={patientsRes.data || []}
      services={servicesRes.data || []}
    />
  )
}
