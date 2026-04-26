import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SettlementsPage from './SettlementsPage.vue'

vi.mock('../composables/useSettlements', () => ({
  useSettlements: () => ({
    isLoading: { value: false },
    data: {
      value: [{ id: 'set-1', summary: 'Weekly reconciliation batch', status: 'Pending review' }],
    },
  }),
}))

describe('SettlementsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders settlement status display', () => {
    const wrapper = mount(SettlementsPage)
    expect(wrapper.text()).toContain('Pending review')
  })
})
