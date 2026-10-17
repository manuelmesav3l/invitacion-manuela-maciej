import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && key ? createClient(url, key) : null

export interface GuestInfo {
  token?: string | null
  name: string
  max_companions: number
  response: null | {
    full_name: string
    attending: boolean
    companions: number
    dietary: string | null
    message: string | null
    email?: string | null
    phone?: string | null
    needs_transport?: boolean | null
    welcome_meeting?: boolean | null
    transport_notes?: string | null
  }
}

export async function fetchGuest(token: string): Promise<GuestInfo | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_guest', { p_token: token })
  if (error || !data) return null
  return data as GuestInfo
}

export async function fetchGuestByPhone(phone: string): Promise<GuestInfo | null> {
  if (!supabase || !phone) return null
  const cleanPhone = phone.trim()
  const digits = cleanPhone.replace(/\D/g, '')
  if (digits.length < 6) return null
  const { data, error } = await supabase.rpc('get_guest_by_phone', { p_phone: cleanPhone })
  if (error || !data) return null
  return data as GuestInfo
}

export interface RsvpPayload {
  token: string | null
  full_name: string
  attending: boolean
  companions: number
  dietary: string
  message: string
  email: string
  phone: string
  needs_transport: boolean | null
  welcome_meeting: boolean | null
  transport_notes?: string | null
}

export async function submitRsvp(p: RsvpPayload) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.rpc('submit_rsvp', {
    p_token: p.token || null, p_full_name: p.full_name, p_attending: p.attending,
    p_companions: p.companions, p_dietary: p.dietary || null, p_message: p.message || null,
    p_email: p.email || null, p_phone: p.phone || null,
    p_needs_transport: p.needs_transport, p_welcome_meeting: p.welcome_meeting,
    p_transport_notes: p.transport_notes || null,
  })
  if (error) throw error
}

export interface AdminGuestRsvp {
  id: string
  full_name: string
  attending: boolean
  companions: number
  dietary?: string | null
  message?: string | null
  phone?: string | null
  email?: string | null
  needs_transport?: boolean | null
  welcome_meeting?: boolean | null
  transport_notes?: string | null
  updated_at?: string | null
}

export interface AdminGuest {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  max_companions: number
  token: string
  notes?: string | null
  created_at?: string | null
  rsvp?: AdminGuestRsvp | null
}

export interface SaveGuestInput {
  id?: string | null
  name: string
  phone?: string | null
  email?: string | null
  max_companions: number
  notes?: string | null
}

export async function adminVerifyPin(pin: string): Promise<boolean> {
  if (!supabase || !pin) return false
  const { data, error } = await supabase.rpc('admin_verify_pin', { p_pin: pin.trim() })
  if (error || typeof data !== 'boolean') return false
  return data
}

export async function adminFetchGuests(pin: string): Promise<AdminGuest[]> {
  if (!supabase) throw new Error('Supabase no está configurado')
  const { data, error } = await supabase.rpc('admin_get_guests', { p_pin: pin.trim() })
  if (error) throw error
  return (data || []) as AdminGuest[]
}

export async function adminSaveGuest(pin: string, input: SaveGuestInput): Promise<AdminGuest> {
  if (!supabase) throw new Error('Supabase no está configurado')
  const { data, error } = await supabase.rpc('admin_save_guest', {
    p_pin: pin.trim(),
    p_id: input.id || null,
    p_name: input.name,
    p_phone: input.phone || null,
    p_email: input.email || null,
    p_max_companions: input.max_companions,
    p_notes: input.notes || null,
  })
  if (error) throw error
  return data as AdminGuest
}

export async function adminDeleteGuest(pin: string, id: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase no está configurado')
  const { data, error } = await supabase.rpc('admin_delete_guest', {
    p_pin: pin.trim(),
    p_id: id,
  })
  if (error) throw error
  return !!data
}

export async function adminChangePin(oldPin: string, newPin: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase no está configurado')
  const { data, error } = await supabase.rpc('admin_change_pin', {
    p_old_pin: oldPin.trim(),
    p_new_pin: newPin.trim(),
  })
  if (error) throw error
  return !!data
}

