import type { FormEvent, ReactNode } from 'react'
import { CATS, REMINDER_KINDS, type AttachedFile, type Car } from '../data'
import { readPickedFile } from '../files'
import { CloseButton, Modal } from './Modal'

export type FormKind = 'doc' | 'service' | 'reminder' | 'car'

/** Loose bag of form values; each modal reads the keys it needs. */
export type FormValues = Partial<Car> & {
  name?: string
  cat?: string
  expires?: string
  notes?: string
  title?: string
  shop?: string
  date?: string
  miles?: string
  cost?: string
  kind?: string
  file?: AttachedFile | null
}
type TextKey = Exclude<keyof FormValues, 'file'>

const TITLES: Record<FormKind, string> = {
  doc: 'Add document',
  service: 'Log service',
  reminder: 'Add reminder',
  car: 'Car details',
}

const CAR_FIELDS: [keyof Car, string, string][] = [
  ['year', 'Year', '2008'],
  ['name', 'Make & model', 'BMW X5'],
  ['trim', 'Trim', '4.8i'],
  ['city', 'City', 'Denver, CO'],
  ['plate', 'Plate', 'BNEB07'],
  ['vin', 'VIN', '17 characters'],
  ['odometer', 'Odometer (mi)', 'e.g. 168000'],
  ['regThrough', 'Registered through', 'Jul 31, 2027'],
  ['insurer', 'Insurer', 'State Farm'],
  ['policy', 'Policy #', ''],
  ['value', 'Est. value', ''],
]

interface Props {
  kind: FormKind
  values: FormValues
  onChange: (patch: Partial<FormValues>) => void
  onSave: () => void
  onClose: () => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      {label}
      {children}
    </label>
  )
}

const grid = (min: number) => ({ gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))` })

export function FormModal({ kind, values: f, onChange, onSave, onClose }: Props) {
  const text = (k: TextKey, extra: Record<string, string> = {}) => ({
    className: 'input' + (extra.mono ? ' mono' : ''),
    value: f[k] ?? '',
    onChange: (e: { target: { value: string } }) => onChange({ [k]: e.target.value }),
    placeholder: extra.placeholder,
    inputMode: extra.inputMode as 'numeric' | 'decimal' | undefined,
  })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <Modal onClose={onClose} maxWidth={520} gap={14} label={TITLES[kind]}>
      <form onSubmit={submit} style={{ display: 'contents' }}>
        <div className="panel-head" style={{ alignItems: 'center' }}>
          <div className="panel-title">{TITLES[kind]}</div>
          <CloseButton onClick={onClose} />
        </div>

        {kind === 'doc' && (
          <div className="form">
            <Field label="Name">
              <input {...text('name', { placeholder: 'e.g. State Farm ID card 2026' })} autoFocus required />
            </Field>
            <div className="form-grid" style={grid(180)}>
              <Field label="Category">
                <select {...text('cat')}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Expires (optional)">
                <input type="date" {...text('expires')} />
              </Field>
            </div>
            <Field label="Notes">
              <textarea rows={3} {...text('notes', { placeholder: 'Policy #, coverage, anything useful' })} />
            </Field>
            <label className="dropzone form">
              <strong>{f.file ? f.file.name : 'Attach a photo or PDF'}</strong>
              <small>Photo or PDF, up to 3 MB</small>
              <input type="file" accept="image/*,application/pdf" onChange={e => readPickedFile(e, file => onChange({ file }))} />
            </label>
          </div>
        )}

        {kind === 'service' && (
          <div className="form">
            <Field label="What was done">
              <input {...text('title', { placeholder: 'e.g. Oil & filter change' })} autoFocus required />
            </Field>
            <Field label="Shop">
              <input {...text('shop', { placeholder: 'e.g. Les Schwab, Federal Blvd' })} />
            </Field>
            <div className="form-grid" style={grid(140)}>
              <Field label="Date">
                <input type="date" {...text('date')} />
              </Field>
              <Field label="Odometer (mi)">
                <input {...text('miles', { inputMode: 'numeric', mono: '1' })} />
              </Field>
              <Field label="Cost ($)">
                <input {...text('cost', { inputMode: 'decimal', placeholder: '0.00', mono: '1' })} />
              </Field>
            </div>
          </div>
        )}

        {kind === 'reminder' && (
          <div className="form">
            <Field label="Reminder">
              <input {...text('title', { placeholder: 'e.g. Oil change' })} autoFocus required />
            </Field>
            <div className="form-grid" style={grid(180)}>
              <Field label="Due date">
                <input type="date" {...text('date')} />
              </Field>
              <Field label="Type">
                <select {...text('kind')}>
                  {REMINDER_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Note">
              <input {...text('notes', { placeholder: 'e.g. Every 7,500 mi' })} />
            </Field>
          </div>
        )}

        {kind === 'car' && (
          <div className="form-grid" style={grid(200)}>
            {CAR_FIELDS.map(([k, label, ph]) => (
              <Field label={label} key={k}>
                <input {...text(k, { placeholder: ph })} />
              </Field>
            ))}
          </div>
        )}

        <div className="form-foot">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save</button>
        </div>
      </form>
    </Modal>
  )
}
