import type { StorefrontEvent } from '../types/storefront'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'

export async function getStorefrontEvent(eventSlug: string): Promise<StorefrontEvent> {
  return {
    slug: eventSlug,
    title: 'Community care collection',
    description:
      'Support recipient funds with a secure, mobile-friendly contribution experience designed for trust and clarity.',
    heroImageLabel: 'People gathered around a warm community fundraiser',
    trustNote: 'Protected checkout, clear receipts, and transparent fund allocation.',
  }
}

export async function getStorefrontRecipientFunds(eventSlug: string): Promise<RecipientFund[]> {
  void eventSlug
  return [
    {
      id: 'fund-1',
      eventId: 'event-1',
      name: 'Medical support',
      description: 'Help cover urgent treatment and aftercare.',
      targetAmount: 7500,
      receivedAmount: 0,
      currency: 'GBP',
    },
    {
      id: 'fund-2',
      eventId: 'event-1',
      name: 'Education costs',
      description: 'Fund school supplies, fees, and transport.',
      targetAmount: 5000,
      receivedAmount: 0,
      currency: 'GBP',
    },
  ]
}
