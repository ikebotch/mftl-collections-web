export interface StorefrontEvent {
  slug: string
  title: string
  description: string
  heroImageLabel: string
  trustNote: string
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
