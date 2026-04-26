import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReceiptsPage from './ReceiptsPage.vue'
import { createPinia, setActivePinia } from 'pinia'

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
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the empty state when there are no receipts', () => {
    const wrapper = mount(ReceiptsPage)
    expect(wrapper.text()).toContain('No data available')
  })
})
