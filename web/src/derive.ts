import { fmtDate, money, today, type GloveboxData, type Reminder, type ServiceEntry, type Tone } from './data'

export interface ReminderView extends Reminder {
  label: string
  tone: Tone
  sort: number
}

/** Reminders with due-date labels, sorted soonest first. Dated reminders within 30 days (or overdue) are flagged. */
export function reminderViews(reminders: Reminder[]): ReminderView[] {
  const now = new Date(today() + 'T12:00:00').getTime()
  return reminders
    .map(r => {
      let label = r.label ?? ''
      let tone: Tone = r.tone ?? 'ok'
      let sort = 9e15
      if (r.date) {
        const days = Math.round((new Date(r.date + 'T12:00:00').getTime() - now) / 864e5)
        sort = days
        label = days < 0 ? 'Overdue' : days === 0 ? 'Today' : days <= 30 ? `${days} day${days === 1 ? '' : 's'}` : fmtDate(r.date)
        tone = days <= 30 ? 'soon' : 'ok'
      } else if (tone === 'soon') {
        sort = -1e9
      }
      return { ...r, label, tone, sort }
    })
    .sort((a, b) => a.sort - b.sort)
}

export interface ServiceView extends ServiceEntry {
  dateFmt: string
  milesFmt: string
  costFmt: string
}

export function serviceViews(service: ServiceEntry[]): ServiceView[] {
  return [...service]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map(x => ({
      ...x,
      dateFmt: fmtDate(x.date),
      milesFmt: x.miles == null ? 'mileage not recorded' : x.miles.toLocaleString('en-US') + ' mi',
      costFmt: x.cost == null ? '—' : money(x.cost),
    }))
}

export function carFacts(car: GloveboxData['car']) {
  const val = (k: string, v: string | false | undefined, ph: string) => ({ k, v: v || ph, empty: !v })
  return [
    val('Odometer', car.odometer && parseInt(car.odometer).toLocaleString('en-US') + ' mi', 'Add mileage'),
    val('VIN', car.vin, 'Add VIN'),
    val('Registered through', car.regThrough, '—'),
    val('Insurance', car.insurer, 'Add insurer'),
    val('Policy #', car.policy, 'Add policy #'),
    val('Est. value', car.value, '—'),
  ]
}
