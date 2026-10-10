import type { ReminderView } from '../derive'

interface Props {
  open: ReminderView[]
  done: ReminderView[]
  onAdd: () => void
  onDone: (id: string) => void
  onUndo: (id: string) => void
  onDelete: (id: string) => void
}

export function Reminders({ open, done, onAdd, onDone, onUndo, onDelete }: Props) {
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Reminders</h1>
        <button className="btn-primary" onClick={onAdd}>+ Add reminder</button>
      </div>
      <div className="rem-grid">
        {open.map(r => (
          <div className="card rem-card" key={r.id}>
            <div className="rem-top">
              <div className="min0">
                <div className="eyebrow">{r.kind}</div>
                <div className="rem-title">{r.title}</div>
                <div className="item-sub">{r.detail}</div>
              </div>
              <div className={'pill' + (r.tone === 'soon' ? ' soon' : '')}>{r.label}</div>
            </div>
            <div className="rem-actions">
              <button className="btn-primary" onClick={() => onDone(r.id)}>Mark done</button>
              <button className="btn-ghost" onClick={() => onDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {done.length > 0 && (
        <div className="done-list">
          <h2 className="done-title">Completed</h2>
          {done.map(r => (
            <div className="done-row" key={r.id}>
              <span>{r.title}</span>
              <button className="link-btn sm" onClick={() => onUndo(r.id)}>Undo</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
