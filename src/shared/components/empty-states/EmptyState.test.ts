import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders the empty state message', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No receipts available',
        description: 'Receipt placeholders will appear here.',
      },
    })

    expect(wrapper.text()).toContain('No receipts available')
  })
})
