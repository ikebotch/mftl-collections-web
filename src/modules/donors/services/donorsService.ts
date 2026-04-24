import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { Donor } from '../types/donor'

export const donorsService = {
  async list(): Promise<Donor[]> {
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
        
        // Track methods
        const method = c.paymentMethod || 'Cash'
        donor.methods[method] = (donor.methods[method] || 0) + 1
        
        if (new Date(c.date) > new Date(donor.lastDonationAt)) {
          donor.lastDonationAt = c.date
          donor.lastEvent = c.event
        }
      })
      
      return Array.from(donorMap.values()).map(d => {
        // Determine preferred method
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
      console.warn('Donors list error:', error)
      return []
    }
  }
}
