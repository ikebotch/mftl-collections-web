import { eventsService } from '@/modules/events/services/eventsService'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import { collectorService } from '@/modules/collector/services/collectorService'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { donorsService } from '@/modules/donors/services/donorsService'
import { receiptsService } from '@/modules/receipts/services/receiptsService'

export interface DashboardSummary {
  totalEvents: number
  totalContributions: number
  totalCollected: number
  activeRecipientFunds: number
  totalCollectors: number
  totalDonors: number
  totalReceipts: number
  recentContributions: any[]
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [events, contributions, collectors, funds, donors, receipts] = await Promise.all([
    eventsService.list().catch(() => []),
    contributionsService.list().catch(() => []),
    collectorService.listAll().catch(() => []),
    recipientFundsService.list().catch(() => []),
    donorsService.list().catch(() => []),
    receiptsService.list().catch(() => [])
  ])

  const totalCollected = contributions.reduce((acc, c) => acc + (c.amountValue || 0), 0)

  return {
    totalEvents: events.length,
    totalContributions: contributions.length,
    totalCollected,
    activeRecipientFunds: funds.length,
    totalCollectors: collectors.length,
    totalDonors: donors.length,
    totalReceipts: receipts.length,
    recentContributions: contributions.slice(0, 5)
  }
}
