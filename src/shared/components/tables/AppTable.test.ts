import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTable from './AppTable.vue'

describe('AppTable', () => {
  it('renders a shared table pattern with headings', () => {
    const wrapper = mount(AppTable, {
      props: {
        caption: 'Example table',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'amount', label: 'Amount' },
        ],
        rows: [{ id: '1', name: 'Fund A', amount: 'GBP 50.00' }],
        rowKey: 'id',
      },
    })

    expect(wrapper.findAll('th')).toHaveLength(2)
    expect(wrapper.text()).toContain('Fund A')
  })
})
