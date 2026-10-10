import type { ChangeEvent } from 'react'
import type { AttachedFile } from './data'

const MAX_BYTES = 3e6

/** Reads the picked file as a data URL so it can be stored alongside the rest of the data. */
export function readPickedFile(e: ChangeEvent<HTMLInputElement>, cb: (file: AttachedFile) => void) {
  const input = e.target
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > MAX_BYTES) {
    alert('Please choose a file under 3 MB.')
    return
  }
  const r = new FileReader()
  r.onload = () => cb({ name: file.name, type: file.type, data: r.result as string })
  r.readAsDataURL(file)
}
