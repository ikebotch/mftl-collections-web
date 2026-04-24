import { describe, it, expect, vi, beforeEach } from 'vitest'
import { eventsService } from '@/modules/events/services/eventsService'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import { httpClient } from '@/core/api/httpClient'

// Mock httpClient to verify the payloads and URLs
vi.mock('@/core/api/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))

describe('Integration Smoke Tests (Service Layer)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Create Event: payload matches backend CreateEventRequest', async () => {
    const payload = {
      title: 'Smoke Test Event',
      description: 'Verifying integration payload',
      eventDate: '2026-12-25'
    }

    vi.mocked(httpClient.post).mockResolvedValue({
      success: true,
      data: { id: 'guid-123', ...payload, isActive: true }
    })

    await eventsService.create(payload)

    expect(httpClient.post).toHaveBeenCalledWith('/events', payload)
  })

  it('Create Recipient Fund: payload matches backend request', async () => {
    const payload = {
      eventId: 'event-guid',
      name: 'Clean Water',
      description: 'Testing fund creation',
      targetAmount: 5000
    }

    vi.mocked(httpClient.post).mockResolvedValue({
      success: true,
      data: { id: 'fund-guid', ...payload, collectedAmount: 0 }
    })

    await recipientFundsService.create(payload)

    expect(httpClient.post).toHaveBeenCalledWith('/recipient-funds', payload)
  })

  it('Record Cash Contribution: payload matches backend contract', async () => {
    const payload = {
      eventId: 'event-guid',
      recipientFundId: 'fund-guid',
      amount: 100.50,
      contributorName: 'Test Contributor',
      note: 'Smoke test note'
    }

    vi.mocked(httpClient.post).mockResolvedValue({
      success: true,
      data: 'contribution-guid'
    })

    await contributionsService.recordCash(payload)

    expect(httpClient.post).toHaveBeenCalledWith('/contributions/cash', payload)
  })

  it('Events List: requests the correct endpoint', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      success: true,
      data: []
    })

    await eventsService.list()

    expect(httpClient.get).toHaveBeenCalledWith('/events')
  })
})
