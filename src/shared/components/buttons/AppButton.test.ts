import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('renders slot content and loading state accessibly', () => {
    const wrapper = mount(AppButton, {
      props: {
        loading: true,
        ariaLabel: 'Submit contribution',
      },
      slots: {
        default: 'Submit',
      },
    })

    expect(wrapper.text()).toContain('Submit')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Submit contribution')
  })
})
