import { createClient } from '@/lib/supabase/server'
import { PatientsContent } from '@/features/patients/components/PatientsContent'

export default async function PatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('doctor_id', user.id)
    .order('created_at', { ascending: false })

  return <PatientsContent patients={patients || []} />
}
