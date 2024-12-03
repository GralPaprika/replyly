import {Document} from '@/lib/ai/models/Document'

export type FilterType = object

export default interface VectorStore {
  similaritySearchWithScore(
    query: string,
    numberOfResults: number,
    metadataFilter?: FilterType | undefined
  ): Promise<[Document, number][]>

  addDocuments(documents: Document[]): Promise<void>
}