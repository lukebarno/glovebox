import { useCallback, useState } from 'react'
import { fmtDate, seed, today, uid, type Doc } from './data'
import { reminderViews, serviceViews } from './derive'
import { exportBackup, useGlovebox } from './store'
import { Overview } from './components/Overview'
import { Documents } from './components/Documents'
import { Service } from './components/Service'
import { Reminders } from './components/Reminders'
import { DocModal } from './components/DocModal'
import { FormModal, type FormKind, type FormValues } from './components/FormModal'

type Tab = 'home' | 'docs' | 'service' | 'reminders'

const TABS: [Tab, string][] = [
  ['home', 'Overview'],
  ['docs', 'Documents'],
  ['service', 'Service'],
  ['reminders', 'Reminders'],
]

export default function App() {
  const { data, update, saved } = useGlovebox()
  const { car, docs, service, reminders, done } = data
  const [tab, setTab] = useState<Tab>('home')
  const [cat, setCat] = useState('All')
  const [docId, setDocId] = useState<string | null>(null)
  const [modal, setModal] = useState<FormKind | null>(null)
  const [form, setForm] = useState<FormValues>({})

  const closeAll = useCallback(() => {
    setModal(null)
    setDocId(null)
  }, [])
  const openForm = (kind: FormKind, values: FormValues) => {
    setDocId(null)
    setForm(values)
    setModal(kind)
  }

  const rem = reminderViews(reminders)
  const openR = rem.filter(r => !done[r.id])
  const doneR = rem.filter(r => done[r.id])
  const svc = serviceViews(service)
  const pinnedRaw = docs.filter(d => d.pinned)
  const pinned = (pinnedRaw.length ? pinnedRaw : docs).slice(0, 4)
  const doc = docId ? docs.find(d => d.id === docId) : undefined

  const save = () => {
    const f = form
    if (modal === 'doc') {
      const name = f.name?.trim()
      if (!name) return
      const fields: Doc['fields'] = []
      if (f.expires) fields.push(['Expires', fmtDate(f.expires)])
      if (f.notes) fields.push(['Notes', f.notes])
      fields.push(['Added', fmtDate(today())])
      const newDoc: Doc = {
        id: uid(),
        cat: f.cat || 'Other',
        name,
        meta: f.expires ? 'Expires ' + fmtDate(f.expires) : 'Added ' + fmtDate(today()),
        fields,
        file: f.file || null,
      }
      update(d => ({ ...d, docs: [newDoc, ...d.docs] }))
    } else if (modal === 'service') {
      const title = f.title?.trim()
      if (!title) return
      const m = parseInt(String(f.miles || '').replace(/\D/g, ''))
      const miles = isNaN(m) ? null : m
      const cost = f.cost == null || f.cost.trim() === '' ? null : parseFloat(f.cost.replace(/[$,]/g, '')) || 0
      update(d => ({
        ...d,
        service: [{ id: uid(), title, shop: f.shop?.trim() || '—', date: f.date || today(), miles, cost }, ...d.service],
        car: miles != null && (!d.car.odometer || miles > parseInt(d.car.odometer)) ? { ...d.car, odometer: String(miles) } : d.car,
      }))
    } else if (modal === 'reminder') {
      const title = f.title?.trim()
      if (!title) return
      update(d => ({
        ...d,
        reminders: [
          ...d.reminders,
          { id: uid(), kind: f.kind || 'Service', title, detail: f.notes || '', date: f.date || '', label: f.date ? null : 'Someday', tone: 'ok' },
        ],
      }))
    } else if (modal === 'car') {
      const next = { ...car }
      for (const k of Object.keys(car) as (keyof typeof car)[]) next[k] = (f[k] ?? '').trim()
      update(d => ({ ...d, car: next }))
    }
    setModal(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="wrap">
          <div className="brand">
            <div className="brand-name">Glovebox</div>
            <div className="brand-car">{[car.year, car.name].filter(Boolean).join(' ')}</div>
          </div>
          <nav className="nav">
            {TABS.map(([id, label]) => (
              <button key={id} className="tab" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </nav>
          <a className="app-link" href="app/Glovebox.dc.html">App view →</a>
        </div>
      </header>

      <main className="main">
        {tab === 'home' && (
          <Overview
            car={car}
            upcoming={openR.slice(0, 3)}
            pinned={pinned}
            recent={svc.slice(0, 3)}
            onEditCar={() => openForm('car', { ...car })}
            onOpenDoc={setDocId}
            goReminders={() => setTab('reminders')}
            goDocs={() => setTab('docs')}
            goService={() => setTab('service')}
          />
        )}
        {tab === 'docs' && (
          <Documents
            docs={docs}
            cat={cat}
            onCat={setCat}
            onOpenDoc={setDocId}
            onAdd={() => openForm('doc', { cat: cat !== 'All' ? cat : 'Insurance' })}
          />
        )}
        {tab === 'service' && (
          <Service
            list={svc}
            onAdd={() => openForm('service', { date: today(), miles: car.odometer || '' })}
            onDelete={id => update(d => ({ ...d, service: d.service.filter(x => x.id !== id) }))}
          />
        )}
        {tab === 'reminders' && (
          <Reminders
            open={openR}
            done={doneR}
            onAdd={() => openForm('reminder', { kind: 'Service' })}
            onDone={id => update(d => ({ ...d, done: { ...d.done, [id]: true } }))}
            onUndo={id =>
              update(d => {
                const next = { ...d.done }
                delete next[id]
                return { ...d, done: next }
              })
            }
            onDelete={id => update(d => ({ ...d, reminders: d.reminders.filter(x => x.id !== id) }))}
          />
        )}
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-status">
            {saved === 'full' ? 'Couldn’t save — storage full' : 'Saved on this device. Export a backup to keep a copy.'}
          </div>
          <button className="link-btn sm" onClick={() => exportBackup(data)}>Export backup</button>
          <button
            className="link-btn sm quiet"
            onClick={() => {
              if (confirm('Reset everything to the data found in your email? Your additions will be removed.')) update(() => seed())
            }}
          >
            Reset to email data
          </button>
        </div>
      </footer>

      {doc && (
        <DocModal
          doc={doc}
          onClose={closeAll}
          onAttach={file => update(d => ({ ...d, docs: d.docs.map(x => (x.id === doc.id ? { ...x, file } : x)) }))}
          onDelete={() => {
            if (!confirm('Delete this document?')) return
            update(d => ({ ...d, docs: d.docs.filter(x => x.id !== doc.id) }))
            setDocId(null)
          }}
        />
      )}

      {modal && (
        <FormModal
          kind={modal}
          values={form}
          onChange={patch => setForm(p => ({ ...p, ...patch }))}
          onSave={save}
          onClose={closeAll}
        />
      )}
    </div>
  )
}
