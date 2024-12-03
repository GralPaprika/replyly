import { defineConfig } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

// @ts-ignore
export default defineConfig({
  schema: './db/schema',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})