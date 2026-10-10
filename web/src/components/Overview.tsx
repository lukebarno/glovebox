import type { Car, Doc } from '../data'
import { carFacts, type ReminderView, type ServiceView } from '../derive'

interface Props {
  car: Car
  upcoming: ReminderView[]
  pinned: Doc[]
  recent: ServiceView[]
  onEditCar: () => void
  onOpenDoc: (id: string) => void
  goReminders: () => void
  goDocs: () => void
  goService: () => void
}

export function Overview({ car, upcoming, pinned, recent, onEditCar, onOpenDoc, goReminders, goDocs, goService }: Props) {
  const sub = [car.year, car.trim, car.city].filter(Boolean).join(' · ')
  return (
    <div className="overview">
      <section className="hero">
        <div className="hero-top">
          <div>
            <div className="brand-car">{sub}</div>
            <h1 className="hero-name">{car.name}</h1>
          </div>
          <div className="hero-actions">
            {car.plate && <div className="plate">{car.plate}</div>}
            <button className="btn-ghost hoverable" onClick={onEditCar}>
              Edit details
            </button>
          </div>
        </div>
        <div className="facts">
          {carFacts(car).map(f => (
            <div className="min0" key={f.k}>
              <div className="fact-k">{f.k}</div>
              <div className={'fact-v' + (f.empty ? ' empty' : '')}>{f.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Coming up</h2>
          <button className="link-btn" onClick={goReminders}>All reminders</button>
        </div>
        {upcoming.map(r => (
          <div className="card upcoming" key={r.id}>
            <div className="min0">
              <div className="item-title">{r.title}</div>
              <div className="item-sub">{r.detail}</div>
            </div>
            <div className={'pill' + (r.tone === 'soon' ? ' soon' : '')}>{r.label}</div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Key documents</h2>
          <button className="link-btn" onClick={goDocs}>All documents</button>
        </div>
        <div className="pinned-grid">
          {pinned.map(d => (
            <button className="card pinned" key={d.id} onClick={() => onOpenDoc(d.id)}>
              <div className="eyebrow">{d.cat}</div>
              <div className="min0">
                <div className="item-title">{d.short || d.name}</div>
                <div className={'pinned-meta' + (d.warn ? ' warn' : '')}>{d.meta}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Recent service</h2>
          <button className="link-btn" onClick={goService}>Service log</button>
        </div>
        <div className="card">
          {recent.map(s => (
            <div className="row recent-row" key={s.id}>
              <div className="min0">
                <div className="item-title">{s.title}</div>
                <div className="item-sub">{s.dateFmt} · {s.shop}</div>
              </div>
              <div className="mono" style={{ fontSize: 14, flex: 'none' }}>{s.costFmt}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
