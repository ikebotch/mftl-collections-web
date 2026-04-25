import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReceiptsPage from './ReceiptsPage.vue'

vi.mock('../composables/useReceipts', () => ({
  useReceipts: () => ({
    isLoading: { value: false },
    isError: { value: false },
    data: {
      value: [],
    },
  }),
}))

describe('ReceiptsPage', () => {
  it('renders the empty state when there are no receipts', () => {
    const wrapper = mount(ReceiptsPage)
    expect(wrapper.text()).toContain('No records found')
  })
})
