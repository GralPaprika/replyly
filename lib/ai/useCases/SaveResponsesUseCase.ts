import {RagRepository} from "@/lib/ai/models/RagRepository";

export class SaveResponsesUseCase {
  constructor(
    private readonly ragRepository: RagRepository,
  ) {}

  async execute(businessLocationId: string, responses: string[]): Promise<void> {
    await this.ragRepository.saveDocuments(responses.map(response => ({
      pageContent: response,
      metadata: { businessLocationId },
    })))
  }
}