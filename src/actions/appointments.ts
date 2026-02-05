'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createAppointment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const serviceId = formData.get('service_id') as string
  const { data: service } = await supabase.from('services').select('duration_minutes').eq('id', serviceId).single()

  const startTime = new Date(formData.get('start_time') as string)
  const endTime = new Date(startTime.getTime() + (service?.duration_minutes || 30) * 60000)

  const { error } = await supabase.from('appointments').insert({
    doctor_id: user.id,
    patient_id: formData.get('patient_id') as string,
    service_id: serviceId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: 'pending',
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/calendar')
  revalidatePath('/')
  return { success: true }
}

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('appointments').update({ status }).eq('id', id).eq('doctor_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/calendar')
  revalidatePath('/')
  revalidatePath(`/appointments/${id}`)
  return { success: true }
}

export async function completeAppointment(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Get appointment with service price
  const { data: appointment } = await supabase
    .from('appointments')
    .select('*, service:services(price)')
    .eq('id', id)
    .single()

  if (!appointment) return { error: 'Cita no encontrada' }

  // Update appointment status
  await supabase.from('appointments').update({ status: 'completed' }).eq('id', id)

  // Create medical note
  const diagnosis = formData.get('diagnosis') as string
  if (diagnosis) {
    await supabase.from('medical_notes').insert({
      appointment_id: id,
      doctor_id: user.id,
      diagnosis,
      prescription: (formData.get('prescription') as string) || null,
      private_notes: (formData.get('private_notes') as string) || null,
    })
  }

  // Create payment
  await supabase.from('payments').insert({
    appointment_id: id,
    doctor_id: user.id,
    amount: appointment.service?.price || 0,
    status: 'paid',
    payment_method: (formData.get('payment_method') as string) || 'efectivo',
    payment_date: new Date().toISOString().split('T')[0],
  })

  revalidatePath('/calendar')
  revalidatePath('/')
  revalidatePath('/finances')
  revalidatePath(`/appointments/${id}`)
  return { success: true }
}
