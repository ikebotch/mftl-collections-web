import type { ContributionRow } from '../types/contribution'

export async function listContributions(): Promise<ContributionRow[]> {
  return [
    {
      id: 'c-1',
      date: '2026-04-24',
      event: 'Community fundraiser',
      recipientFund: 'Medical support',
      paymentMethod: 'cash',
      status: 'Recorded',
      amount: 'GBP 50.00',
    },
  ]
}
