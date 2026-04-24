import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContributionsPage from './ContributionsPage.vue'

vi.mock('../composables/useContributions', () => ({
  useContributions: () => ({
    data: {
      value: [
        {
          id: 'c-1',
          date: '2026-04-24',
          event: 'Community fundraiser',
          recipientFund: 'Medical support',
          paymentMethod: 'cash',
          status: 'Recorded',
          amount: 'GBP 50.00',
        },
      ],
    },
  }),
}))

describe('ContributionsPage', () => {
  it('renders the contribution table', () => {
    const wrapper = mount(ContributionsPage)
    expect(wrapper.text()).toContain('Community fundraiser')
  })
})
