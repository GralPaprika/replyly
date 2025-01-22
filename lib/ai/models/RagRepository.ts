import {Document} from "@/lib/ai/models/Document";

export interface RagRepository {
  retrieveRelevantResponses(businessLocationId: string, clientRequest: string): Promise<[Document, number][]>
  saveDocuments(documents: Document[]): Promise<void>
}