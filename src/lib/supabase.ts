import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && key ? createClient(url, key) : null

export interface GuestInfo {
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
}

export async function submitRsvp(p: RsvpPayload) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.rpc('submit_rsvp', {
    p_token: p.token, p_full_name: p.full_name, p_attending: p.attending,
    p_companions: p.companions, p_dietary: p.dietary || null, p_message: p.message || null,
    p_email: p.email || null, p_phone: p.phone || null,
    p_needs_transport: p.needs_transport, p_welcome_meeting: p.welcome_meeting,
  })
  if (error) throw error
}
