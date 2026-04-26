export interface ContributionRow {
  id: string
  date: string
  event: string
  recipientFund: string
  paymentMethod: string
  status: string
  amount: string
  amountValue: number
  currency: string
  contributorName: string
  contributorPhone: string
  contributorEmail?: string
  receiptId?: string | null
  note?: string | null
  collectorName?: string | null
}
