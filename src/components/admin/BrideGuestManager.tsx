import { useCallback, useEffect, useMemo, useState } from 'react'
import { CloseIcon } from '../Icons'
import { GuestFormModal } from './GuestFormModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import {
  adminVerifyPin,
  adminFetchGuests,
  adminSaveGuest,
  adminDeleteGuest,
  type AdminGuest,
  type SaveGuestInput,
} from '../../lib/supabase'

const PIN_STORAGE_KEY = 'boda_novia_pin'
const DEFAULT_SUGGESTED_PIN = 'manuela2026'

interface BrideGuestManagerProps {
  open: boolean
  onClose: () => void
}

type FilterStatus = 'all' | 'confirmed' | 'pending' | 'declined'

export function BrideGuestManager({ open, onClose }: BrideGuestManagerProps) {
  const [pin, setPin] = useState(() => localStorage.getItem(PIN_STORAGE_KEY) || '')
  const [pinInput, setPinInput] = useState(() => localStorage.getItem(PIN_STORAGE_KEY) || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [authError, setAuthError] = useState('')

  const [guests, setGuests] = useState<AdminGuest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [needsMigration, setNeedsMigration] = useState(false)

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [guestToEdit, setGuestToEdit] = useState<AdminGuest | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<AdminGuest | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filters & search
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  // Notification Toast
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 3200)
  }

  const loadGuests = useCallback(async (currentPin: string) => {
    setIsLoading(true)
    setFetchError('')
    setNeedsMigration(false)
    try {
      const list = await adminFetchGuests(currentPin)
      setGuests(list)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('admin_get_guests') || msg.includes('does not exist')) {
        setNeedsMigration(true)
      } else {
        setFetchError(msg || 'No se pudieron cargar los invitados')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-verify saved PIN on modal open
  useEffect(() => {
    if (!open || !pin) return
    let ignore = false

    adminVerifyPin(pin)
      .then((valid) => {
        if (ignore) return
        if (valid) {
          setIsAuthenticated(true)
          loadGuests(pin)
        } else {
          setAuthError('Clave incorrecta. Intenta nuevamente.')
          setIsAuthenticated(false)
        }
      })
      .catch((err: unknown) => {
        if (ignore) return
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('function admin_verify_pin') || msg.includes('does not exist')) {
          setNeedsMigration(true)
        } else {
          setAuthError('Error de conexión con Supabase. Revisa la red o las credenciales.')
        }
        setIsAuthenticated(false)
      })

    return () => {
      ignore = true
    }
  }, [open, pin, loadGuests])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pinInput.trim()) return
    setIsVerifying(true)
    setAuthError('')
    try {
      const valid = await adminVerifyPin(pinInput)
      if (valid) {
        setIsAuthenticated(true)
        localStorage.setItem(PIN_STORAGE_KEY, pinInput.trim())
        setPin(pinInput.trim())
        loadGuests(pinInput.trim())
      } else {
        setAuthError('Clave incorrecta. Intenta nuevamente.')
        setIsAuthenticated(false)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('function admin_verify_pin') || msg.includes('does not exist')) {
        setNeedsMigration(true)
      } else {
        setAuthError('Error de conexión con Supabase. Revisa la red o las credenciales.')
      }
      setIsAuthenticated(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(PIN_STORAGE_KEY)
    setPin('')
    setPinInput('')
    setIsAuthenticated(false)
    setGuests([])
  }

  // Save guest (create or edit)
  const handleSaveGuest = async (data: SaveGuestInput) => {
    await adminSaveGuest(pin, data)
    showToast(data.id ? 'Invitado actualizado exitosamente' : '¡Nuevo invitado agregado!')
    // reload list
    await loadGuests(pin)
  }

  // Delete guest
  const handleConfirmDelete = async () => {
    if (!guestToDelete) return
    try {
      setIsDeleting(true)
      await adminDeleteGuest(pin, guestToDelete.id)
      setGuests((prev) => prev.filter((g) => g.id !== guestToDelete.id))
      setDeleteModalOpen(false)
      setGuestToDelete(null)
      showToast('Invitado eliminado correctamente')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar invitado'
      alert(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  // Copy personal link
  const getGuestLink = (token: string) => {
    const origin = window.location.origin + window.location.pathname
    return `${origin}?g=${encodeURIComponent(token)}`
  }

  const handleCopyLink = async (guest: AdminGuest) => {
    const link = getGuestLink(guest.token)
    try {
      await navigator.clipboard.writeText(link)
      showToast(`¡Enlace copiado para ${guest.name}!`)
    } catch {
      prompt('Copia este enlace para el invitado:', link)
    }
  }

  // Send WhatsApp
  const handleWhatsApp = (guest: AdminGuest) => {
    const link = getGuestLink(guest.token)
    const text = `¡Hola ${guest.name}! ✨ Te compartimos con mucho cariño nuestra invitación a nuestra boda de Manuela & Maciej: ${link} \n\nPor favor ingresa para conocer los detalles y confirmar tu asistencia. ¡Nos hace mucha ilusión celebrar contigo!`
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '')
    if (cleanPhone.length >= 7) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    } else {
      // If no valid phone registered, prompt to open WhatsApp or copy text
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    }
  }

  // Export to CSV
  const handleExportCsv = () => {
    if (!guests.length) {
      alert('No hay invitados para exportar')
      return
    }

    const headers = [
      'Nombre',
      'Teléfono',
      'Email',
      'Cupos Permitidos',
      'Estado RSVP',
      'Asiste',
      'Total Personas Asistiendo',
      'Requiere Transporte',
      'Notas Transporte',
      'Welcome Meeting',
      'Restricciones Alimentarias',
      'Mensaje',
      'Notas Privadas',
      'Token Invitación',
      'Enlace Directo',
    ]

    const rows = guests.map((g) => {
      const r = g.rsvp
      const link = getGuestLink(g.token)
      const rsvpStatus = !r ? 'Pendiente' : r.attending ? 'Confirmado' : 'No asiste'
      const totalPax = r?.attending ? 1 + (r.companions || 0) : 0

      return [
        `"${(g.name || '').replace(/"/g, '""')}"`,
        `"${(g.phone || r?.phone || '').replace(/"/g, '""')}"`,
        `"${(g.email || r?.email || '').replace(/"/g, '""')}"`,
        1 + (g.max_companions || 0),
        `"${rsvpStatus}"`,
        r ? (r.attending ? 'SÍ' : 'NO') : 'Sin responder',
        totalPax,
        r?.needs_transport === true ? 'SÍ' : r?.needs_transport === false ? 'NO' : '-',
        `"${(r?.transport_notes || '').replace(/"/g, '""')}"`,
        r?.welcome_meeting === true ? 'SÍ' : r?.welcome_meeting === false ? 'NO' : '-',
        `"${(r?.dietary || '').replace(/"/g, '""')}"`,
        `"${(r?.message || '').replace(/"/g, '""')}"`,
        `"${(g.notes || '').replace(/"/g, '""')}"`,
        `"${g.token}"`,
        `"${link}"`,
      ].join(',')
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invitados_boda_manuela_maciej_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Archivo CSV descargado')
  }

  // Filter & Search Logic
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = g.name.toLowerCase().includes(q)
        const matchesPhone = (g.phone || '').includes(q) || (g.rsvp?.phone || '').includes(q)
        const matchesNotes = (g.notes || '').toLowerCase().includes(q)
        if (!matchesName && !matchesPhone && !matchesNotes) return false
      }

      // Status
      if (statusFilter === 'confirmed') return g.rsvp?.attending === true
      if (statusFilter === 'declined') return g.rsvp && g.rsvp.attending === false
      if (statusFilter === 'pending') return !g.rsvp

      return true
    })
  }, [guests, search, statusFilter])

  // Metrics
  const stats = useMemo(() => {
    const totalInvitations = guests.length
    let totalConfirmedGuests = 0
    let totalPaxConfirmed = 0
    let totalDeclined = 0
    let totalPending = 0

    guests.forEach((g) => {
      if (!g.rsvp) {
        totalPending++
      } else if (g.rsvp.attending) {
        totalConfirmedGuests++
        totalPaxConfirmed += 1 + (g.rsvp.companions || 0)
      } else {
        totalDeclined++
      }
    })

    return { totalInvitations, totalConfirmedGuests, totalPaxConfirmed, totalDeclined, totalPending }
  }, [guests])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="bride-panel-title"
        className="relative w-full max-w-5xl h-[94vh] sm:h-[90vh] bg-[#1a2015] text-[#FAF5EE] rounded-3xl border border-[#bf9a58]/40 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <header className="px-5 py-4 sm:px-7 sm:py-5 border-b border-white/10 flex items-center justify-between bg-[#141a10] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👰‍♀️</span>
              <h2 id="bride-panel-title" className="font-serif text-xl sm:text-2xl text-[#e8d7c5] tracking-wide">
                Gestión de Invitados
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-[#bf9a58] tracking-widest uppercase">
              Panel Exclusivo de la Novia · Manuela & Maciej
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/20 text-xs text-cream-light/70 hover:text-cream-light hover:bg-white/5 transition-colors"
              >
                Cerrar Sesión
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel de administración"
              className="grid h-10 w-10 place-items-center rounded-full text-cream-light/70 hover:text-cream-light hover:bg-white/10 transition-colors"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-6 right-6 z-50 bg-[#bf9a58] text-[#1c2217] font-medium px-4 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm animate-bounce-short border border-white/20">
              {toast}
            </div>
          )}

          {/* Authentication Screen */}
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center px-4">
              <div className="w-16 h-16 rounded-full bg-[#bf9a58]/15 border border-[#bf9a58]/40 grid place-items-center text-3xl mb-4">
                🔐
              </div>
              <h3 className="font-serif text-2xl text-[#e8d7c5] mb-2">Ingreso a Gestión de Invitados</h3>
              <p className="text-xs text-cream-light/70 mb-6 leading-relaxed">
                Ingresa la clave de acceso para ver, agregar, editar y eliminar los invitados de la boda.
              </p>

              {authError && (
                <div className="w-full mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  {authError}
                </div>
              )}

              {needsMigration && (
                <div className="w-full mb-5 p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs text-left space-y-2">
                  <p className="font-bold">⚠️ Falta ejecutar el script SQL en Supabase:</p>
                  <p>
                    Abre el SQL Editor de tu proyecto Supabase y ejecuta el archivo{' '}
                    <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">
                      0006_bride_guest_management.sql
                    </code>.
                  </p>
                  <a
                    href="https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 font-bold underline text-[#e8d7c5] hover:text-white"
                  >
                    Abrir SQL Editor de Supabase ↗
                  </a>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="w-full space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Introduce la clave de acceso"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#12160e] border border-[#bf9a58]/40 text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:ring-2 focus:ring-[#bf9a58] text-center text-base tracking-widest"
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 text-xs font-bold uppercase tracking-widest bg-[#bf9a58] text-[#1c2217] rounded-xl hover:bg-[#d6af68] transition-all disabled:opacity-50 shadow-lg active:scale-98"
                >
                  {isVerifying ? 'Verificando...' : 'Entrar al Panel'}
                </button>
              </form>

              <p className="mt-4 text-[11px] text-cream-light/40">
                Clave inicial por defecto: <code className="text-[#bf9a58]">{DEFAULT_SUGGESTED_PIN}</code>
              </p>
            </div>
          ) : (
            /* Authenticated Dashboard */
            <>
              {/* Needs Migration Banner if SQL error */}
              {needsMigration && (
                <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold">⚠️ Se requiere ejecutar la migración en Supabase:</span>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">
                      Para habilitar agregar y editar invitados, copia el contenido de <code>supabase/migrations/0006_bride_guest_management.sql</code> y ejecútalo en el SQL Editor.
                    </p>
                  </div>
                  <a
                    href="https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Ir a Supabase SQL Editor
                  </a>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#232b1d] border border-white/5">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-cream-light/60 block mb-1">
                    Total Invitaciones
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#e8d7c5]">
                    {stats.totalInvitations}
                  </div>
                  <span className="text-[11px] text-cream-light/40">familias o personas registradas</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1d2b1f] border border-emerald-500/20">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-300/80 block mb-1">
                    Confirmados (SÍ)
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 flex items-baseline gap-2">
                    {stats.totalPaxConfirmed}
                    <span className="text-xs font-sans font-normal text-emerald-300/70">
                      personas ({stats.totalConfirmedGuests} invitaciones)
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300/50">cupos confirmados para recepción</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#2c2718] border border-amber-500/20">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300/80 block mb-1">
                    Pendientes
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                    {stats.totalPending}
                  </div>
                  <span className="text-[11px] text-amber-300/50">aún no han respondido</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#2b1f1f] border border-red-500/20">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-red-300/80 block mb-1">
                    No Asisten
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-red-300">
                    {stats.totalDeclined}
                  </div>
                  <span className="text-[11px] text-red-300/50">declinaron la invitación</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-light/40 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, teléfono o notas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#12160e] border border-white/10 text-sm text-cream-light placeholder:text-cream-light/35 focus:outline-none focus:ring-2 focus:ring-[#bf9a58]"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-cream-light/50 hover:text-cream-light"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Buttons Action */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  <button
                    type="button"
                    onClick={() => {
                      setGuestToEdit(null)
                      setFormModalOpen(true)
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#bf9a58] text-[#1c2217] font-bold text-xs uppercase tracking-wider hover:bg-[#d6af68] transition-all flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                  >
                    <span>➕</span>
                    <span>Nuevo Invitado</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    title="Descargar lista completa en Excel / CSV"
                    className="px-3.5 py-2.5 rounded-xl bg-[#232b1d] border border-white/10 text-cream-light hover:bg-[#2e3725] text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>📥</span>
                    <span className="hidden sm:inline">Exportar</span> CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => loadGuests(pin)}
                    disabled={isLoading}
                    title="Recargar lista"
                    className="p-2.5 rounded-xl bg-[#232b1d] border border-white/10 text-cream-light hover:bg-[#2e3725] transition-colors shrink-0"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs">
                {(
                  [
                    ['all', 'Todos', guests.length],
                    ['confirmed', 'Confirmados', stats.totalConfirmedGuests],
                    ['pending', 'Pendientes', stats.totalPending],
                    ['declined', 'No Asisten', stats.totalDeclined],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      statusFilter === key
                        ? 'bg-[#bf9a58] text-[#1c2217] font-bold shadow'
                        : 'text-cream-light/60 hover:text-cream-light hover:bg-white/5'
                    }`}
                  >
                    {label} <span className="opacity-75 font-sans">({count})</span>
                  </button>
                ))}
              </div>

              {/* Guests List / Cards */}
              {isLoading ? (
                <div className="py-16 text-center text-cream-light/50 text-sm animate-pulse space-y-2">
                  <div className="text-2xl">⏳</div>
                  <p>Cargando lista de invitados desde Supabase...</p>
                </div>
              ) : fetchError ? (
                <div className="py-12 text-center text-red-300 text-sm max-w-md mx-auto">
                  <p className="mb-3">{fetchError}</p>
                  <button
                    type="button"
                    onClick={() => loadGuests(pin)}
                    className="px-4 py-2 rounded-lg bg-[#bf9a58] text-[#1c2217] font-bold text-xs"
                  >
                    Reintentar
                  </button>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="py-16 text-center text-cream-light/50 text-sm space-y-2">
                  <div className="text-3xl">📭</div>
                  <p className="text-[#e8d7c5] font-serif text-lg">No se encontraron invitados</p>
                  <p className="text-xs text-cream-light/40">
                    {search ? 'Intenta con otro término de búsqueda' : 'Haz clic en "Nuevo Invitado" para agregar el primero.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredGuests.map((guest) => {
                    const r = guest.rsvp
                    const isConfirmed = r?.attending === true
                    const isDeclined = r && r.attending === false
                    const isPending = !r
                    const totalPax = isConfirmed ? 1 + (r.companions || 0) : 0

                    return (
                      <div
                        key={guest.id}
                        className="p-4 rounded-2xl bg-[#1c2317] border border-white/5 hover:border-[#bf9a58]/30 transition-all flex flex-col justify-between gap-3 shadow-md"
                      >
                        {/* Guest Header */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-lg text-white font-medium tracking-wide">
                                {guest.name}
                              </h4>
                              {guest.phone && (
                                <p className="text-xs text-[#bf9a58] font-mono mt-0.5">
                                  📱 {guest.phone}
                                </p>
                              )}
                              {guest.email && (
                                <p className="text-xs text-cream-light/50 mt-0.5">
                                  ✉️ {guest.email}
                                </p>
                              )}
                            </div>

                            {/* Status Badge */}
                            <div>
                              {isConfirmed && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                                  <span>✓</span> Asiste ({totalPax} pax)
                                </span>
                              )}
                              {isDeclined && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-950/80 text-red-300 border border-red-500/30">
                                  <span>✕</span> No asiste
                                </span>
                              )}
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                                  <span>⏳</span> Pendiente
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Allowance & RSVP Details */}
                          <div className="mt-3 pt-2.5 border-t border-white/5 text-xs text-cream-light/70 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-cream-light/50">Cupos autorizados:</span>
                              <span className="text-[#e8d7c5] font-medium">
                                {guest.max_companions === 0
                                  ? '1 persona (individual)'
                                  : `Titular + ${guest.max_companions} acom. (${guest.max_companions + 1} cupos)`}
                              </span>
                            </div>

                            {/* If RSVP confirmed: show details */}
                            {isConfirmed && r && (
                              <div className="bg-[#141a10] p-2 rounded-lg text-[11px] space-y-0.5 text-cream-light/80 mt-1.5 border border-white/5">
                                {r.needs_transport !== null && (
                                  <div>
                                    🚌 <span className="text-cream-light/60">Transporte:</span>{' '}
                                    <strong className="text-cream-light">{r.needs_transport ? 'Sí requiere' : 'No'}</strong>
                                    {r.transport_notes && ` (${r.transport_notes})`}
                                  </div>
                                )}
                                {r.welcome_meeting !== null && (
                                  <div>
                                    🥂 <span className="text-cream-light/60">Welcome Meeting:</span>{' '}
                                    <strong className="text-cream-light">{r.welcome_meeting ? 'Sí asiste' : 'No'}</strong>
                                  </div>
                                )}
                                {r.dietary && (
                                  <div>
                                    🍽️ <span className="text-cream-light/60">Dieta/Alergias:</span> {r.dietary}
                                  </div>
                                )}
                                {r.message && (
                                  <div className="italic text-cream-light/70 text-[10px] mt-1 pt-1 border-t border-white/5">
                                    "{r.message}"
                                  </div>
                                )}
                              </div>
                            )}

                            {guest.notes && (
                              <p className="text-[11px] text-[#bf9a58]/80 italic mt-1">
                                📌 Nota: {guest.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex items-center justify-between border-t border-white/5 gap-1.5">
                          {/* Share Actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleWhatsApp(guest)}
                              title="Enviar invitación por WhatsApp"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center gap-1 transition-colors"
                            >
                              <span>💬</span>
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyLink(guest)}
                              title="Copiar enlace personal de invitación"
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cream-light/80 text-xs border border-white/10 flex items-center gap-1 transition-colors"
                            >
                              <span>🔗</span>
                              <span className="hidden sm:inline">Copiar Link</span>
                            </button>
                          </div>

                          {/* Edit / Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setGuestToEdit(guest)
                                setFormModalOpen(true)
                              }}
                              title="Editar datos del invitado"
                              aria-label={`Editar ${guest.name}`}
                              className="p-1.5 rounded-lg text-cream-light/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGuestToDelete(guest)
                                setDeleteModalOpen(true)
                              }}
                              title="Eliminar invitado"
                              aria-label={`Eliminar ${guest.name}`}
                              className="p-1.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Guest Form Modal (Add / Edit) */}
      <GuestFormModal
        key={guestToEdit?.id || (formModalOpen ? 'open-new' : 'closed')}
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setGuestToEdit(null)
        }}
        guestToEdit={guestToEdit}
        onSave={handleSaveGuest}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        guest={guestToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setDeleteModalOpen(false)
          setGuestToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
