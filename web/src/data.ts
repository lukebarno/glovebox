export const CATS = ['Registration', 'Insurance', 'Inspection', 'Receipts', 'License', 'Other'] as const
export const REMINDER_KINDS = ['Service', 'Renewal', 'Insurance', 'Other'] as const

export interface Car {
  year: string
  name: string
  trim: string
  city: string
  plate: string
  vin: string
  odometer: string
  regThrough: string
  insurer: string
  policy: string
  value: string
}

export interface AttachedFile {
  name: string
  type: string
  data: string
}

export interface Doc {
  id: string
  cat: string
  name: string
  short?: string
  meta: string
  url?: string
  pinned?: boolean
  warn?: boolean
  fields: [string, string][]
  file?: AttachedFile | null
}

export interface ServiceEntry {
  id: string
  title: string
  shop: string
  date: string
  miles: number | null
  cost: number | null
}

export type Tone = 'soon' | 'ok'

export interface Reminder {
  id: string
  kind: string
  title: string
  detail: string
  date?: string
  label?: string | null
  tone?: Tone
}

export interface GloveboxData {
  car: Car
  docs: Doc[]
  service: ServiceEntry[]
  reminders: Reminder[]
  done: Record<string, boolean>
}

const G = 'https://mail.google.com/mail/?authuser=barnocky2@gmail.com#all/'
const gm = (id: string) => G + 'thread-f:' + id + '|msg-f:' + id

export const seed = (): GloveboxData => ({
  car: {
    year: '2008',
    name: 'BMW X5',
    trim: '4.8i',
    city: 'Denver, CO',
    plate: 'BNEB07',
    vin: '',
    odometer: '',
    regThrough: 'Jul 31, 2027',
    insurer: 'State Farm',
    policy: '',
    value: '$1,900 (Carvana, 2024)',
  },
  docs: [
    {
      id: 'reg', cat: 'Registration', name: 'Registration renewal + temp permit', short: 'Registration',
      meta: 'Renewed Aug 18, 2026 · tags by mail', url: gm('1873837649678577414'), pinned: true,
      fields: [['State', 'Colorado DMV'], ['Plate', 'BNEB07'], ['Renewed', 'Aug 18, 2026 (online)'], ['In email', 'TempPermit.PDF'], ['Next due', 'Jul 31, 2027']],
    },
    {
      id: 'notice', cat: 'Registration', name: 'Registration renewal notice',
      meta: 'Aug 3, 2026 · $88.79', url: gm('1872558929714840491'),
      fields: [['Vehicle', '2008 BMW · BNEB07'], ['Fees', '$88.79 · $117.79 w/ Parks Pass'], ['Emissions', 'No test required'], ['In email', 'Vehicle Renewal Notice.PDF']],
    },
    {
      id: 'ins', cat: 'Insurance', name: 'Insurance ID card', short: 'Insurance card', warn: true, pinned: true,
      meta: 'Sent Mar 27, 2025 · check it’s current', url: gm('1827722958699098288'),
      fields: [['Carrier', 'State Farm (family policy)'], ['From', 'Mom, Mar 27, 2025'], ['In email', 'Lukes insurance card.pdf']],
    },
    {
      id: 'insp', cat: 'Inspection', name: 'Vehicle inspection report', short: 'Inspection', pinned: true,
      meta: 'Firestone · Jul 29, 2024', url: gm('1806037795565592816'),
      fields: [['Shop', 'Firestone Complete Auto Care, Flatirons'], ['Vehicle', '2008 BMW X5 4.8i'], ['Date', 'Jul 29, 2024'], ['In email', 'VehicleInspectionInformation.pdf']],
    },
    {
      id: 'dl', cat: 'License', name: 'Driver license renewal', short: 'Driver license', pinned: true,
      meta: 'Renewed Sep 10, 2026 · card by mail', url: gm('1875921908162501018'),
      fields: [['Via', 'myColorado'], ['Renewed', 'Sep 10, 2026'], ['New card', 'Arrives within 30 days']],
    },
    {
      id: 'ls', cat: 'Receipts', name: 'Alignment — Les Schwab',
      meta: 'Jun 6, 2025 · Federal Blvd', url: gm('1834027094225976403'),
      fields: [['Service', 'Alignment'], ['Shop', 'Les Schwab, 2001 Federal Blvd'], ['Phone', '303-455-9424']],
    },
    {
      id: 'arms', cat: 'Receipts', name: 'Control arms + inspection',
      meta: 'Jun 12, 2025 · $1,100', url: gm('1834749632460213586'),
      fields: [['Work', 'Control arms & inspection'], ['Paid', '$1,100 (Zelle from Dad)'], ['Date', 'Jun 12, 2025']],
    },
    {
      id: 'tix2', cat: 'Receipts', name: 'Parking tickets — paid',
      meta: 'Oct 30, 2025 · 2 tickets', url: gm('1847426183174883020'),
      fields: [['Status', 'Paid by Dad'], ['Date', 'Oct 30, 2025']],
    },
    {
      id: 'tix1', cat: 'Receipts', name: 'Denver parking ticket — paid',
      meta: 'Jun 13, 2025', url: gm('1834839131848419335'),
      fields: [['Status', 'Paid by Dad'], ['Date', 'Jun 13, 2025']],
    },
  ],
  service: [
    { id: 's1', title: 'Control arms + inspection', shop: 'Shop not listed', date: '2025-06-12', miles: null, cost: 1100 },
    { id: 's2', title: 'Alignment', shop: 'Les Schwab · Federal Blvd', date: '2025-06-06', miles: null, cost: null },
    { id: 's3', title: 'Vehicle inspection', shop: 'Firestone · Flatirons', date: '2024-07-29', miles: null, cost: null },
  ],
  reminders: [
    { id: 'ins', kind: 'Insurance', title: 'Get your current insurance card', detail: 'Newest on file is from Mar 2025 · State Farm', label: 'Check', tone: 'soon' },
    { id: 'insp', kind: 'Service', title: 'Yearly inspection', detail: 'Last full inspection Jul 2024 (Firestone)', date: '2025-07-29' },
    { id: 'dl', kind: 'License', title: 'New driver license in the mail', detail: 'Renewed Sep 10 via myColorado', date: '2026-10-10' },
    { id: 'oil', kind: 'Service', title: 'Log your last oil change', detail: 'None found in your email', label: 'Add', tone: 'ok' },
    { id: 'reg', kind: 'Renewal', title: 'Registration renewal', detail: 'Colorado DMV · $88.79 last time · no emissions', date: '2027-07-31' },
  ],
  done: {},
})

export const fmtDate = (s?: string) => {
  if (!s) return ''
  const d = new Date(s + 'T12:00:00')
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const money = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })

export const uid = () => Math.random().toString(36).slice(2, 9)

/** Today's date as YYYY-MM-DD in local time. */
export const today = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
