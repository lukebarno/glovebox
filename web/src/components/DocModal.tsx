import type { AttachedFile, Doc } from '../data'
import { readPickedFile } from '../files'
import { CloseButton, Modal } from './Modal'

interface Props {
  doc: Doc
  onClose: () => void
  onAttach: (file: AttachedFile) => void
  onDelete: () => void
}

export function DocModal({ doc, onClose, onAttach, onDelete }: Props) {
  const file = doc.file
  return (
    <Modal onClose={onClose} maxWidth={580} gap={16} label={doc.name}>
      <div className="panel-head">
        <div className="min0" style={{ flex: 1 }}>
          <div className="eyebrow">{doc.cat}</div>
          <div className="doc-title">{doc.name}</div>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      {file?.type.startsWith('image/') && <img className="preview" src={file.data} alt={doc.name} />}
      {file?.type === 'application/pdf' && <iframe className="preview" src={file.data} title={doc.name} />}

      {!file && (
        <label className="dropzone tall">
          <strong>Attach a scan or PDF</strong>
          <small>
            {doc.url
              ? 'The original is attached to the email — download it from Gmail, then add it here'
              : 'Photo or PDF, up to 3 MB'}
          </small>
          <input type="file" accept="image/*,application/pdf" onChange={e => readPickedFile(e, onAttach)} />
        </label>
      )}

      {doc.fields.length > 0 && (
        <div className="card" style={{ borderRadius: 12 }}>
          {doc.fields.map(([k, v], i) => (
            <div className="row kv-row" key={i}>
              <div className="k">{k}</div>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="doc-actions">
        {doc.url && (
          <a className="btn-primary" href={doc.url} target="_blank" rel="noopener">
            Open in Gmail
          </a>
        )}
        {file && (
          <a className="btn-ghost" href={file.data} download={file.name}>
            Download file
          </a>
        )}
        <button className="btn-ghost danger" onClick={onDelete}>Delete</button>
      </div>
    </Modal>
  )
}
