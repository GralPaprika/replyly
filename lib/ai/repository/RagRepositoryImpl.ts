import {RagRepository} from "@/lib/ai/models/RagRepository";
import {Document} from "@/lib/ai/models/Document"
import VectorStore from "@/lib/ai/VectorStore";

const NumberOfSimilarResults = 5

export class RagRepositoryImpl implements RagRepository {
  constructor(
    private readonly vectorStore: VectorStore,
  ) {}

  retrieveRelevantResponses(businessLocationId: string, clientRequest: string): Promise<[Document, number][]> {
    return this.vectorStore.similaritySearchWithScore(
      clientRequest,
      NumberOfSimilarResults,
      { businessLocationId },
    )
  }

  saveDocuments(documents: Document[]): Promise<void> {
    return this.vectorStore.addDocuments(documents)
  }
}