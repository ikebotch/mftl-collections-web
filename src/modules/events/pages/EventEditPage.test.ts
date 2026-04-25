import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EventEditPage from './EventEditPage.vue'

// Mocking vue-router
const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'event-123' }
  }),
  useRouter: () => ({
    replace: mockReplace
  })
}))

describe('EventEditPage Redirect', () => {
  it('redirects to detail page on mount', () => {
    mount(EventEditPage)
    
    expect(mockReplace).toHaveBeenCalledWith({
      name: 'admin-events-detail',
      params: { id: 'event-123' },
      query: { edit: 'true' }
    })
  })
})
