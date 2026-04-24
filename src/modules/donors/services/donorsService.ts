import { httpClient } from '@/core/api/httpClient'
import type { DonorRow, DonorDto } from '../types/donor'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'

export async function listDonors(): Promise<DonorRow[]> {
  const response = await httpClient.get<DonorDto[]>('/donors')
  const data = response.data || []
  
  return data.map(dto => ({
    id: dto.email || dto.name, // Fallback ID for unique keys
    name: dto.name,
    email: dto.email,
    totalDonated: formatCurrency(dto.totalGiven, 'GHS'),
    donationCount: dto.contributionCount,
    lastDonation: dto.lastDonationDate ? formatDate(dto.lastDonationDate) : 'Never',
    frequency: dto.contributionCount > 5 ? 'High' : 'Regular',
    isAnonymous: dto.isAnonymous
  }))
}

export const donorsService = {
  list: listDonors
}
