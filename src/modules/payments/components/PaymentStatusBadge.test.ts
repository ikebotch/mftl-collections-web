import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentStatusBadge from './PaymentStatusBadge.vue'

describe('PaymentStatusBadge', () => {
  it('renders payment status text', () => {
    const wrapper = mount(PaymentStatusBadge, {
      props: {
        status: 'Pending',
      },
    })

    expect(wrapper.text()).toContain('Pending')
  })
})
