import { useEffect, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  maxWidth: number
  gap: number
  label: string
  children: ReactNode
}

export function Modal({ onClose, maxWidth, gap, label, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={{ maxWidth, gap }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn-close" onClick={onClick} aria-label="Close">
      ×
    </button>
  )
}
