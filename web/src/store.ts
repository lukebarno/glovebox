import { useCallback, useEffect, useRef, useState } from 'react'
import { seed, type GloveboxData } from './data'

const KEY = 'glovebox-web-v1'

export type SaveState = 'idle' | 'ok' | 'full'

function load(): GloveboxData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...seed(), ...JSON.parse(raw) }
  } catch {
    // Unreadable storage: fall back to the email seed.
  }
  return seed()
}

/** App data persisted to localStorage on every change. */
export function useGlovebox() {
  const [data, setData] = useState<GloveboxData>(load)
  const [saved, setSaved] = useState<SaveState>('idle')
  const dirty = useRef(false)

  useEffect(() => {
    if (!dirty.current) return
    dirty.current = false
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
      setSaved('ok')
    } catch {
      setSaved('full')
      alert('Storage is full — try a smaller file.')
    }
  }, [data])

  const update = useCallback((fn: (d: GloveboxData) => GloveboxData) => {
    dirty.current = true
    setData(fn)
  }, [])

  return { data, update, saved }
}

export function exportBackup(data: GloveboxData) {
  const b = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(b)
  a.download = 'glovebox-backup.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
