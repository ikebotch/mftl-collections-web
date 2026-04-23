import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTable from './AppTable.vue'

describe('AppTable', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' }
  ]

  const data = [
    { name: 'John Doe', role: 'Admin' },
    { name: 'Jane Smith', role: 'User' }
  ]

  it('renders correct number of rows and columns', () => {
    const wrapper = mount(AppTable, {
      props: { columns, data }
    })
    
    // Header row + 2 data rows
    expect(wrapper.findAll('tr').length).toBe(3)
    
    // 2 columns per row
    expect(wrapper.findAll('th').length).toBe(2)
  })

  it('renders data correctly', () => {
    const wrapper = mount(AppTable, {
      props: { columns, data }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Admin')
  })

  it('renders empty state when no data', () => {
    const wrapper = mount(AppTable, {
      props: { columns, data: [] }
    })
    
    expect(wrapper.text()).toContain('No data available.')
  })
})
