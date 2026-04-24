import { eventsService } from '@/modules/events/services/eventsService'

export interface DashboardSummary {
  totalEvents: string
  totalContributions: string
  totalCollected: string
  activeRecipientFunds: string
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const events = await eventsService.list().catch(() => [])
  return {
    totalEvents: String(events.length),
    totalContributions: '0',
    totalCollected: 'GBP 0.00',
    activeRecipientFunds: '0',
  }
}
