import {RagRepository} from "@/lib/ai/models/RagRepository";
import {Document} from "@/lib/ai/models/Document";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetBestResponsesToClientRequestUseCase {
  constructor(
    private readonly ragRepository: RagRepository,
    private readonly whatsappRepository: WhatsappRepository
  ) {}

  async execute(whatsappId: string, clientRequest: string): Promise<[Document, number][]> {
    const businessLocationId = await this.whatsappRepository.getBusinessLocationByWhatsappId(whatsappId)
    return await this.ragRepository.retrieveRelevantResponses(businessLocationId, clientRequest)
  }
}