import {drizzle, PostgresJsDatabase} from "drizzle-orm/postgres-js"
import postgres from "postgres"
import VectorStore from "@/lib/ai/VectorStore";
import {RootComposition as LlmComposition} from "@/llm-replyly/composition/RootComposition";

export class AppComposition {
  private static instance: AppComposition
  private database!: PostgresJsDatabase
  private llmComposition!: LlmComposition

  private constructor() {}

  static getInstance(): AppComposition {
    return AppComposition.instance ??= new AppComposition()
  }

  private getLlmComposition(): LlmComposition {
    return this.llmComposition ??= LlmComposition.getInstance()
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

  async getVectorStore(): Promise<VectorStore> {
    return this.getLlmComposition().provideVectorStore()
  }
}
