export interface DonorRow {
  id: string
  name: string
  email: string | null
  totalDonated: string
  donationCount: number
  lastDonation: string
  frequency: string
  isAnonymous: boolean
}

export interface DonorDto {
  name: string
  email: string | null
  phoneNumber: string | null
  totalGiven: number
  contributionCount: number
  lastDonationDate: string | null
  eventsSupportedCount: number
  preferredPaymentMethod: string | null
  isAnonymous: boolean
}
