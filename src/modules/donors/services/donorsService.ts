import { httpClient } from '@/core/api/httpClient'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { Donor } from '../types/donor'

interface DonorDto {
  id: string
  name: string
  email: string
  phoneNumber?: string
  isAnonymous: boolean
  totalGiven: number
  contributionCount: number
  lastDonationAt?: string
}

function mapDonorDto(dto: DonorDto): Donor {
  return {
    id: dto.id,
    name: dto.name || 'Anonymous Donor',
    phone: dto.phoneNumber || '',
    email: dto.email || '',
    totalGiven: dto.totalGiven,
    lastDonationAt: dto.lastDonationAt || 'Unknown',
    donationCount: dto.contributionCount,
    status: 'active',
    eventsSupported: 0, // Backend doesn't provide this directly in the list
    preferredMethod: 'Unknown',
    lastEvent: 'Unknown'
  }
}

export const donorsService = {
  async list(): Promise<Donor[]> {
    try {
      const response = await httpClient.get<DonorDto[]>('/donors')
      if (response.data && response.data.length > 0) {
        return response.data.map(mapDonorDto)
      }
    } catch (error) {
      console.warn('Donors real endpoint error, falling back to derivation:', error)
    }

    // Fallback derivation logic
    try {
      const contributions = await contributionsService.list()
      const donorMap = new Map<string, Donor & { methods: Record<string, number>, events: Set<string> }>()
      
      contributions.forEach(c => {
        const isAnonymous = !c.contributorPhone && (!c.contributorName || c.contributorName.toLowerCase() === 'anonymous')
        if (isAnonymous) return

        const key = c.contributorPhone || c.contributorName
        
        if (!donorMap.has(key)) {
          donorMap.set(key, {
            id: key,
            name: c.contributorName || 'Unknown Donor',
            phone: c.contributorPhone,
            email: c.contributorEmail,
            totalGiven: 0,
            lastDonationAt: c.date,
            donationCount: 0,
            status: 'active',
            methods: {},
            events: new Set<string>(),
            eventsSupported: 0,
            preferredMethod: 'Cash',
            lastEvent: c.event
          } as any)
        }
        
        const donor = donorMap.get(key)!
        donor.totalGiven += c.amountValue
        donor.donationCount++
        donor.events.add(c.event)
        
        const method = c.paymentMethod || 'Cash'
        donor.methods[method] = (donor.methods[method] || 0) + 1
        
        if (new Date(c.date) > new Date(donor.lastDonationAt)) {
          donor.lastDonationAt = c.date
          donor.lastEvent = c.event
        }
      })
      
      return Array.from(donorMap.values()).map(d => {
        let maxCount = 0
        let preferred = 'Cash'
        Object.entries(d.methods).forEach(([m, count]) => {
          if (count > maxCount) {
            maxCount = count
            preferred = m
          }
        })
        
        return {
          ...d,
          eventsSupported: d.events.size,
          preferredMethod: preferred
        }
      }).sort((a, b) => b.totalGiven - a.totalGiven)
    } catch (error) {
      console.warn('Donors derivation error:', error)
      return []
    }
  },

  async getById(id: string): Promise<Donor> {
    try {
      const response = await httpClient.get<DonorDto>(`/donors/${id}`)
      return mapDonorDto(response.data)
    } catch (error) {
      console.warn('Donor getById error:', error)
      throw error
    }
  }
}
