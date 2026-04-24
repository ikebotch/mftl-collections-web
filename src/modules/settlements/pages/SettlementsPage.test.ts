import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettlementsPage from './SettlementsPage.vue'

vi.mock('../composables/useSettlements', () => ({
  useSettlements: () => ({
    data: {
      value: [{ id: 'set-1', summary: 'Weekly reconciliation batch', status: 'Pending review' }],
    },
  }),
}))

describe('SettlementsPage', () => {
  it('renders settlement status display', () => {
    const wrapper = mount(SettlementsPage)
    expect(wrapper.text()).toContain('Pending review')
  })
})
