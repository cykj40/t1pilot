import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) throw new Error('TURSO_DATABASE_URL is not set')
  return createClient({ url, ...(authToken !== undefined && { authToken }) })
}

export function getTursoDb() {
  return drizzle(getTursoClient())
}

export type TursoDb = ReturnType<typeof getTursoDb>
