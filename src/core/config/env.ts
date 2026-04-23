import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_AUTH0_DOMAIN: z.string().min(1),
  VITE_AUTH0_CLIENT_ID: z.string().min(1),
  VITE_AUTH0_AUDIENCE: z.string().min(1),
  VITE_TENANT_HEADER_NAME: z.string().default('X-Tenant-Id'),
})

export const env = envSchema.parse(import.meta.env)
