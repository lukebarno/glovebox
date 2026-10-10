import { money } from '../data'
import type { ServiceView } from '../derive'

interface Props {
  list: ServiceView[]
  onAdd: () => void
  onDelete: (id: string) => void
}

export function Service({ list, onAdd, onDelete }: Props) {
  const spend = list.reduce((a, x) => a + (x.cost || 0), 0)
  const stats = [
    ['Logged spend', money(Math.round(spend))],
    ['Visits', String(list.length)],
    ['Last visit', list[0]?.dateFmt || '—'],
  ]
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Service log</h1>
        <button className="btn-primary" onClick={onAdd}>+ Log service</button>
      </div>
      <div className="stats">
        {stats.map(([k, v]) => (
          <div className="card stat" key={k}>
            <div className="fact-k">{k}</div>
            <div className="stat-v">{v}</div>
          </div>
        ))}
      </div>
      {list.length > 0 && (
        <div className="card">
          {list.map(s => (
            <div className="row svc-row" key={s.id}>
              <div className="min0">
                <div className="svc-title">{s.title}</div>
                <div className="svc-sub">
                  {s.dateFmt} · {s.shop} · <span className="svc-miles">{s.milesFmt}</span>
                </div>
              </div>
              <div className="svc-right">
                <div className="svc-cost">{s.costFmt}</div>
                <button className="btn-delete" onClick={() => onDelete(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
