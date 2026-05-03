export interface StorefrontEvent {
  id: string
  slug: string
  title: string
  description: string
  displayImageUrl?: string
  trustNote?: string
  isActive: boolean
}

export interface ContributionDraft {
  eventSlug: string
  eventId?: string
  recipientFundId: string
  fundName?: string
  amount: number
  currency: 'GHS' | 'GBP' | 'EUR'
  contributorName: string
  contributorPhone: string
  contributorEmail: string
  anonymous: boolean
  note: string
  paymentMethod: 'card' | 'momo' | 'bank'
  momoNetwork?: string
}
