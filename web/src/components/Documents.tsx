import { CATS, type Doc } from '../data'

interface Props {
  docs: Doc[]
  cat: string
  onCat: (cat: string) => void
  onOpenDoc: (id: string) => void
  onAdd: () => void
}

export function Documents({ docs, cat, onCat, onOpenDoc, onAdd }: Props) {
  const list = docs.filter(d => cat === 'All' || d.cat === cat)
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Documents</h1>
        <button className="btn-primary" onClick={onAdd}>+ Add document</button>
      </div>
      <div className="chips">
        {['All', ...CATS].map(c => (
          <button key={c} className="chip" aria-pressed={c === cat} onClick={() => onCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="doc-grid">
        {list.map(d => (
          <button className="card doc-card" key={d.id} onClick={() => onOpenDoc(d.id)}>
            <div className="doc-thumb" />
            <div className="min0" style={{ flex: 1 }}>
              <div className="eyebrow">{d.cat}</div>
              <div className="item-title">{d.name}</div>
              <div className={'item-sub' + (d.warn ? ' warn' : '')}>{d.meta}</div>
            </div>
          </button>
        ))}
      </div>
      {list.length === 0 && <div className="empty-box">Nothing in this category yet.</div>}
    </div>
  )
}
