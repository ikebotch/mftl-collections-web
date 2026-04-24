import { eventsService } from '@/modules/events/services/eventsService'
import { listReceipts } from '@/modules/receipts/services/receiptsService'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import type { CollectorDashboardSummary, CollectorEventRow, CollectorReceipt } from '../types/collector'

function parseDisplayedCurrencyAmount(value: string): { amount: number; currency: string } {
  const currencyMatch = value.match(/[A-Z]{3}/)
  const amount = Number.parseFloat(value.replace(/[^0-9.-]/g, ''))

  return {
    amount: Number.isFinite(amount) ? amount : 0,
    currency: currencyMatch?.[0] ?? 'GBP',
  }
}

export async function listAssignedEvents(): Promise<CollectorEventRow[]> {
  const events = await eventsService.list()
  return events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || 'Ready for collection capture.',
    eventDate: formatDate(e.eventDate),
    status: e.status,
  }))
}

export async function getCollectorDashboard(): Promise<CollectorDashboardSummary> {
  const [events, receipts] = await Promise.all([listAssignedEvents(), listCollectorHistory()])
  const totals = receipts.reduce(
    (accumulator, receipt) => {
      const parsed = parseDisplayedCurrencyAmount(receipt.amount)
      return {
        amount: accumulator.amount + parsed.amount,
        currency: accumulator.currency || parsed.currency,
      }
    },
    { amount: 0, currency: 'GBP' },
  )

  return {
    totalCollected: formatCurrency(totals.amount, totals.currency),
    contributionCount: String(receipts.length),
    assignedEvents: String(events.length),
    recentReceipts: receipts.slice(0, 5),
  }
}

export async function listCollectorHistory(): Promise<CollectorReceipt[]> {
  const receipts = await listReceipts()
  return receipts.map(receipt => ({
    id: receipt.id,
    amount: receipt.amount,
    status: receipt.status,
    receiptNumber: receipt.receiptNumber,
    issuedAt: receipt.issuedAt,
    contributorName: receipt.contributorName,
    eventTitle: receipt.eventTitle,
    paymentMethod: receipt.paymentMethod,
    contributionStatus: receipt.contributionStatus,
    paymentStatus: receipt.paymentStatus,
  }))
}

export const collectorService = {
  listAssignedEvents,
  getCollectorDashboard,
  listCollectorHistory,
}
