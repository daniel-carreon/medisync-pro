export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  doctor_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  gender: string | null
  date_of_birth: string | null
  allergies: string | null
  notes: string | null
  created_at: string
}

export interface Service {
  id: string
  doctor_id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  created_at: string
}

export interface Appointment {
  id: string
  doctor_id: string
  patient_id: string
  service_id: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  patient?: Patient
  service?: Service
  medical_note?: MedicalNote
  payment?: Payment
}

export interface MedicalNote {
  id: string
  appointment_id: string
  doctor_id: string
  diagnosis: string
  prescription: string | null
  private_notes: string | null
  created_at: string
}

export interface Payment {
  id: string
  appointment_id: string
  doctor_id: string
  amount: number
  status: 'paid' | 'pending'
  payment_method: string | null
  payment_date: string
  created_at: string
}
