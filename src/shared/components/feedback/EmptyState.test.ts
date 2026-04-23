import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders title and description', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No Data',
        description: 'Try adding some'
      }
    })
    
    expect(wrapper.text()).toContain('No Data')
    expect(wrapper.text()).toContain('Try adding some')
  })
})
