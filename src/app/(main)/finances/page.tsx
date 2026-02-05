import { createClient } from '@/lib/supabase/server'
import { FinancesContent } from '@/features/finances/components/FinancesContent'

export default async function FinancesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date()
  const startOfDay = today.toISOString().split('T')[0]
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]

  const { data: payments } = await supabase
    .from('payments')
    .select('*, appointment:appointments(*, patient:patients(first_name, last_name), service:services(name))')
    .eq('doctor_id', user.id)
    .order('created_at', { ascending: false })

  const allPayments = payments || []
  const paidPayments = allPayments.filter(p => p.status === 'paid')

  const todayIncome = paidPayments.filter(p => p.payment_date >= startOfDay).reduce((s, p) => s + Number(p.amount), 0)
  const weekIncome = paidPayments.filter(p => p.payment_date >= startOfWeek).reduce((s, p) => s + Number(p.amount), 0)
  const monthIncome = paidPayments.filter(p => p.payment_date >= startOfMonth).reduce((s, p) => s + Number(p.amount), 0)

  return (
    <FinancesContent
      payments={allPayments}
      todayIncome={todayIncome}
      weekIncome={weekIncome}
      monthIncome={monthIncome}
    />
  )
}
