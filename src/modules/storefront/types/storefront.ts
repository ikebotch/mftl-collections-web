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
  recipientFundId: string
  amount: number
  contributorName: string
  contributorPhone: string
  contributorEmail: string
  anonymous: boolean
  note: string
  paymentMethod: 'card' | 'momo' | 'cash'
}
