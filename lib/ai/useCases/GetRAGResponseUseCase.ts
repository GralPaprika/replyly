import {RagRepository} from "@/lib/ai/models/RagRepository";

export class GetRAGResponseUseCase {
  constructor(private readonly ragRepository: RagRepository) {}

  /**
   * TODO - Implement this method
   * @param whatsappId
   * @param clientRequest
   */
  async execute(whatsappId: string, clientRequest: string): Promise<string> {
    return ""
  }
}