import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CollectorReceiptPage from './CollectorReceiptPage.vue'

describe('CollectorReceiptPage', () => {
  it('renders receipt confirmation placeholder', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/collector/history', component: { template: '<div />' } }],
    })

    const wrapper = mount(CollectorReceiptPage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Receipt confirmation')
  })
})
