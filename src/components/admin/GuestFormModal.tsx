import { useState } from 'react'
import { CloseIcon } from '../Icons'
import type { AdminGuest, SaveGuestInput } from '../../lib/supabase'

interface GuestFormModalProps {
  open: boolean
  onClose: () => void
  guestToEdit: AdminGuest | null
  onSave: (guestData: SaveGuestInput) => Promise<void>
}

export function GuestFormModal({ open, onClose, guestToEdit, onSave }: GuestFormModalProps) {
  const [name, setName] = useState(guestToEdit?.name || '')
  const [phone, setPhone] = useState(guestToEdit?.phone || '')
  const [maxCompanions, setMaxCompanions] = useState(guestToEdit?.max_companions ?? 0)
  const [email, setEmail] = useState(guestToEdit?.email || '')
  const [notes, setNotes] = useState(guestToEdit?.notes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('El nombre del invitado es obligatorio')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      await onSave({
        id: guestToEdit?.id,
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim().toLowerCase() || null,
        max_companions: maxCompanions,
        notes: notes.trim() || null,
      })
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el invitado'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-guest-title"
        className="relative w-full max-w-lg bg-[#242b1e] text-[#FAF5EE] rounded-2xl border border-[#bf9a58]/30 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-cream-light/70 hover:text-cream-light hover:bg-white/10 transition-colors"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h3 id="modal-guest-title" className="font-serif text-2xl text-[#e8d7c5] tracking-wide mb-1">
          {guestToEdit ? 'Editar Invitado' : 'Agregar Nuevo Invitado'}
        </h3>
        <p className="text-xs text-cream-light/60 tracking-wider uppercase mb-6">
          {guestToEdit ? 'Actualiza los datos del invitado' : 'Se generará su enlace personal automáticamente'}
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-900/40 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="guest-name" className="block text-xs font-medium uppercase tracking-wider text-[#bf9a58] mb-1">
              Nombre Completo o Familia *
            </label>
            <input
              id="guest-name"
              type="text"
              required
              placeholder="Ej: Familia Restrepo o Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#181d14] border border-[#bf9a58]/30 text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:ring-2 focus:ring-[#bf9a58] text-sm"
            />
          </div>

          <div>
            <label htmlFor="guest-phone" className="block text-xs font-medium uppercase tracking-wider text-[#bf9a58] mb-1">
              Teléfono Celular / WhatsApp
            </label>
            <input
              id="guest-phone"
              type="tel"
              placeholder="Ej: +123 456 7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#181d14] border border-[#bf9a58]/30 text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:ring-2 focus:ring-[#bf9a58] text-sm"
            />
            <span className="block text-[11px] text-cream-light/50 mt-1">
              Permite que el invitado confirme ingresando solo su número de WhatsApp.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#bf9a58] mb-1.5">
              Cupos Adicionales / Acompañantes Permitidos
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxCompanions(n)}
                  className={`py-2 text-center rounded-lg border text-sm font-medium transition-all ${
                    maxCompanions === n
                      ? 'bg-[#bf9a58] text-[#242b1e] border-[#bf9a58] font-bold shadow-md'
                      : 'bg-[#181d14] text-cream-light/70 border-white/10 hover:border-[#bf9a58]/50'
                  }`}
                >
                  {n === 0 ? 'Solo él/ella' : `+${n}`}
                </button>
              ))}
            </div>
            <span className="block text-[11px] text-cream-light/50 mt-1.5">
              {maxCompanions === 0
                ? 'Invitación individual (1 cupo en total).'
                : `Invitación para titular + hasta ${maxCompanions} acompañante(s) (${maxCompanions + 1} cupos en total).`}
            </span>
          </div>

          <div>
            <label htmlFor="guest-email" className="block text-xs font-medium uppercase tracking-wider text-[#bf9a58] mb-1">
              Correo Electrónico (Opcional)
            </label>
            <input
              id="guest-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#181d14] border border-[#bf9a58]/30 text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:ring-2 focus:ring-[#bf9a58] text-sm"
            />
          </div>

          <div>
            <label htmlFor="guest-notes" className="block text-xs font-medium uppercase tracking-wider text-[#bf9a58] mb-1">
              Notas privadas para los novios (Opcional)
            </label>
            <textarea
              id="guest-notes"
              rows={2}
              placeholder="Ej: Mesa de familiares, Amigos de la universidad, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#181d14] border border-[#bf9a58]/30 text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:ring-2 focus:ring-[#bf9a58] text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs uppercase tracking-wider text-cream-light/70 hover:text-cream-light transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#bf9a58] text-[#1c2217] rounded-lg hover:bg-[#d6af68] transition-all disabled:opacity-50 shadow-lg active:scale-95"
            >
              {isSubmitting ? 'Guardando...' : guestToEdit ? 'Guardar Cambios' : 'Crear Invitado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
