import { z } from 'zod'

const optionalString = z.string().trim().optional().default('')

export const configSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1).default('MFTL Collections'),
  VITE_API_BASE_URL: z.string().trim().url().default('http://localhost:7072/api'),
  VITE_API_VERSION: z.string().trim().min(1).default('v1'),
  VITE_AUTH0_DOMAIN: optionalString,
  VITE_AUTH0_CLIENT_ID: optionalString,
  VITE_AUTH0_AUDIENCE: optionalString,
  VITE_AUTH0_CALLBACK_URL: z.string().trim().url().default('http://localhost:5174/auth/callback'),
  VITE_TENANT_HEADER_NAME: z.string().trim().min(1).default('X-Tenant-Id'),
  VITE_AUTH_DEV_BYPASS: z.string().trim().transform((v) => v === 'true').default(false),
  VITE_DEBUG_API: z.string().trim().transform((v) => v === 'true').default(false),
})

export type ConfigSchema = z.infer<typeof configSchema>
