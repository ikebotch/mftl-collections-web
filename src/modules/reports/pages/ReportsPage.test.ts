import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReportsPage from './ReportsPage.vue'

vi.mock('../../contributions/composables/useContributions', () => ({
  useContributions: () => ({
    isLoading: { value: false },
    data: { value: [] }
  })
}))

describe('ReportsPage', () => {
  it('renders report filters and export placeholder', () => {
    const wrapper = mount(ReportsPage)
    expect(wrapper.text()).toContain('Total Raised')
    expect(wrapper.text()).toContain('Generate PDF')
  })
})
