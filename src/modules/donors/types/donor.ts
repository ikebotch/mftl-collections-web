export interface Donor {
  id: string
  name: string
  phone: string
  email?: string
  totalGiven: number
  lastDonationAt: string
  donationCount: number
  status: 'active' | 'blocked'
}

export interface DonorDto {
  id: string
  name: string
  phone: string
  email?: string
  totalGiven: number
  lastDonationAt: string
  donationCount: number
}
