import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/features/dashboard/components/DashboardContent'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

  const [patientsRes, todayAptsRes, monthPaymentsRes, upcomingRes, weekPaymentsRes] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('doctor_id', user.id),
    supabase.from('appointments').select('id, status', { count: 'exact' }).eq('doctor_id', user.id).gte('start_time', startOfDay).lt('start_time', endOfDay),
    supabase.from('payments').select('amount').eq('doctor_id', user.id).eq('status', 'paid').gte('payment_date', startOfMonth.split('T')[0]),
    supabase.from('appointments').select('*, patient:patients(*), service:services(*)').eq('doctor_id', user.id).gte('start_time', startOfDay).order('start_time', { ascending: true }).limit(5),
    supabase.from('payments').select('amount, payment_date').eq('doctor_id', user.id).eq('status', 'paid').gte('payment_date', new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
  ])

  const totalPatients = patientsRes.count || 0
  const todayAppointments = todayAptsRes.count || 0
  const monthIncome = (monthPaymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0)
  const completedToday = (todayAptsRes.data || []).filter(a => a.status === 'completed').length
  const completionRate = todayAppointments > 0 ? Math.round((completedToday / todayAppointments) * 100) : 0

  // Group payments by day for chart
  const last7Days: { day: string; amount: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })
    const dayTotal = (weekPaymentsRes.data || [])
      .filter(p => p.payment_date === dateStr)
      .reduce((sum, p) => sum + Number(p.amount), 0)
    last7Days.push({ day: dayLabel, amount: dayTotal })
  }

  return (
    <DashboardContent
      totalPatients={totalPatients}
      todayAppointments={todayAppointments}
      monthIncome={monthIncome}
      completionRate={completionRate}
      upcomingAppointments={upcomingRes.data || []}
      weeklyRevenue={last7Days}
    />
  )
}
