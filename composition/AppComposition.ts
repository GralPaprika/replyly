import {drizzle, PostgresJsDatabase} from "drizzle-orm/postgres-js"
import postgres from "postgres"
import Ajv from "ajv";

export class AppComposition {
  private static instance: AppComposition
  private database!: PostgresJsDatabase
  private ajv!: Ajv

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

  getAjv(): Ajv {
    return this.ajv ??= new Ajv()
  }
}
