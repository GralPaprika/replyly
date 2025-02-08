import {drizzle, PostgresJsDatabase} from "drizzle-orm/postgres-js"
import postgres from "postgres"
import {SchedulerRepository} from "@/lib/scheduler/SchedulerRepository";
import {SchedulerRepositoryImpl} from "@/lib/scheduler/SchedulerRepositoryImpl";

export class AppComposition {
  private static instance: AppComposition
  private database!: PostgresJsDatabase
  private schedulerRepository!: SchedulerRepository

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

  provideSchedulerRepository(): SchedulerRepository {
    return this.schedulerRepository ??= new SchedulerRepositoryImpl()
  }
}
