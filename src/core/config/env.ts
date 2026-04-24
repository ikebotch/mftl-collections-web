import { configSchema, type ConfigSchema } from './configSchema'

export function parseEnv(source: Record<string, unknown>): ConfigSchema {
  return configSchema.parse(source)
}

export const env = parseEnv(import.meta.env)
