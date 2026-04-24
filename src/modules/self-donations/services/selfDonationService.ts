import type { SelfDonationHistoryItem } from '../types/selfDonation'

export type SelfDonationRow = SelfDonationHistoryItem

export async function listSelfDonations(): Promise<SelfDonationHistoryItem[]> {
  return [
    { id: 'receipt-1', amount: 'GBP 35.00', receiptStatus: 'Receipt placeholder' },
  ]
}
