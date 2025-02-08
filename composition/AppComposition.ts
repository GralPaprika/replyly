import {drizzle, PostgresJsDatabase} from "drizzle-orm/postgres-js"
import postgres from "postgres"
import PQueue from "p-queue";

export class AppComposition {
  private static instance: AppComposition
  private database!: PostgresJsDatabase
  private queue!: PQueue

  private constructor() {}

  static getInstance(): AppComposition {
    return AppComposition.instance ??= new AppComposition()
  }

  getDatabase(): PostgresJsDatabase {
    if (!this.database) {
      // How to connect to a supabase database:
      // https://supabase.com/docs/guides/database/drizzle
      const client = postgres(process.env.DATABASE_URL ?? '', { prepare: false })
      this.database = drizzle(client)
    }
    return this.database
  }

  getQueue(): PQueue {
    return this.queue ??= new PQueue({ concurrency: 1 })
  }
}
