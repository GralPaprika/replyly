import VectorStore, {FilterType} from "@/lib/ai/VectorStore";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {Document} from "@/lib/ai/models/Document";
import {LangchainDocumentToDocumentMapper} from "@/llm-replyly/vectorStore/mappers/LangchainDocumentToDocumentMapper";

export class VectorStoreImpl implements VectorStore {
  constructor(
    private vectorStore: PGVectorStore,
    private documentToDocumentMapper: LangchainDocumentToDocumentMapper,
  ) {}

  async similaritySearchWithScore(
    query: string,
    numberOfResults: number,
    metadataFilter?: FilterType | undefined,
  ): Promise<[Document, number][]> {
    return (await this.vectorStore.similaritySearchWithScore(query, numberOfResults, {...metadataFilter}))
      .map(([document, score]) => ([
        this.documentToDocumentMapper.map(document),
        score,
      ]))
  }

  async addDocuments(documents: Document[]): Promise<void> {
    await this.vectorStore.addDocuments(documents)
  }
}