import { describe, expect, it } from 'vitest'
import { router } from './index'

describe('router', () => {
  it('registers admin, storefront, collector, and auth callback routes', () => {
    const paths = router.getRoutes().map((route) => route.path)

    expect(paths).toContain('/admin')
    expect(paths).toContain('/contribute/:eventSlug')
    expect(paths).toContain('/collector')
    expect(paths).toContain('/auth/callback')
  })
})
