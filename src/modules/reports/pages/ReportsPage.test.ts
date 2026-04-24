import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ReportsPage from './ReportsPage.vue'

describe('ReportsPage', () => {
  it('renders report filters and export placeholder', () => {
    const wrapper = mount(ReportsPage)
    expect(wrapper.text()).toContain('Date range')
    expect(wrapper.text()).toContain('Export CSV')
  })
})
