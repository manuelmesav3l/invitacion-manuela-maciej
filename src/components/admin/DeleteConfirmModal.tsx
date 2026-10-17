import { CloseIcon } from '../Icons'
import type { AdminGuest } from '../../lib/supabase'

interface DeleteConfirmModalProps {
  open: boolean
  guest: AdminGuest | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteConfirmModal({ open, guest, isDeleting, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!open || !guest) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="delete-modal-title"
        className="relative w-full max-w-md bg-[#242b1e] text-[#FAF5EE] rounded-2xl border border-red-500/30 shadow-2xl p-6"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Cerrar ventana"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-cream-light/70 hover:text-cream-light hover:bg-white/10 transition-colors"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-red-950/80 border border-red-500/40 text-red-300">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div>
            <h3 id="delete-modal-title" className="font-serif text-xl text-red-200">
              ¿Eliminar invitado?
            </h3>
            <p className="text-xs text-cream-light/60">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <p className="text-sm text-cream-light/80 mb-6 bg-[#181d14] p-3 rounded-lg border border-white/5">
          ¿Segura que deseas eliminar a <strong className="text-white font-semibold">"{guest.name}"</strong>? 
          {guest.rsvp && (
            <span className="block mt-1 text-xs text-amber-300/80">
              ⚠️ Nota: Este invitado ya tenía una respuesta RSVP registrada y también se borrará.
            </span>
          )}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs uppercase tracking-wider text-cream-light/70 hover:text-cream-light transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
