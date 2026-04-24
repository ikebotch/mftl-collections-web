import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { Donor } from '../types/donor'

export const donorsService = {
  async list(): Promise<Donor[]> {
    try {
      const contributions = await contributionsService.list()
      const donorMap = new Map<string, Donor>()
      
      contributions.forEach(c => {
        const key = c.contributorPhone || c.contributorName || 'anonymous'
        if (key === 'anonymous') return

        if (!donorMap.has(key)) {
          donorMap.set(key, {
            id: key,
            name: c.contributorName,
            phone: c.contributorPhone,
            email: c.contributorEmail,
            totalGiven: 0,
            lastDonationAt: c.date,
            donationCount: 0,
            status: 'active'
          })
        }
        
        const donor = donorMap.get(key)!
        donor.totalGiven += c.amountValue
        donor.donationCount++
        
        if (new Date(c.date) > new Date(donor.lastDonationAt)) {
          donor.lastDonationAt = c.date
        }
      })
      
      return Array.from(donorMap.values()).sort((a, b) => b.totalGiven - a.totalGiven)
    } catch (error) {
      console.warn('Donors list error:', error)
      return []
    }
  }
}
