import {OpenAIEmbeddings} from "@langchain/openai";
import {DistanceStrategy, PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import * as tableConfig from "@/llm-replyly/config/VectorTableConfig.json";
import VectorStore from "@/lib/ai/VectorStore";
import {VectorStoreImpl} from "@/llm-replyly/vectorStore/VectorStoreImpl";
import {LangchainDocumentToDocumentMapper} from "@/llm-replyly/vectorStore/mappers/LangchainDocumentToDocumentMapper";

const OPENAI_MODEL = 'text-embedding-3-small'

export class RootComposition {
  private static instance: RootComposition
  private embeddings!: OpenAIEmbeddings
  private pgVectorStore!: PGVectorStore
  private vectorStore!: VectorStore
  private langchainDocumentToDocumentMapper!: LangchainDocumentToDocumentMapper

  private constructor() {}

  static getInstance(): RootComposition {
    return RootComposition.instance ??= new RootComposition()
  }

  private getEmbeddings(): OpenAIEmbeddings {
    return this.embeddings ??= new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: OPENAI_MODEL,
    })
  }

  private async getPGVectorStore(): Promise<PGVectorStore> {
    const { tableName, columns, distanceStrategy} = tableConfig
    const config = {
      postgresConnectionOptions: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      },
      tableName,
      columns,
      distanceStrategy: (distanceStrategy as DistanceStrategy),
    }
    return this.pgVectorStore ??= await PGVectorStore.initialize(this.getEmbeddings(), config)
  }

  private getLangchainDocumentToDocumentMapper() {
    return this.langchainDocumentToDocumentMapper ??= new LangchainDocumentToDocumentMapper()
  }

  async provideVectorStore(): Promise<VectorStore> {
    return this.vectorStore ??= new VectorStoreImpl(
      await this.getPGVectorStore(),
      this.getLangchainDocumentToDocumentMapper(),
    )
  }
}