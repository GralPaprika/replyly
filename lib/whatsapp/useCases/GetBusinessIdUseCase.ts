import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetBusinessIdUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  async execute(whatsappId: string): Promise<string> {
    return this.whatsappRepository.getBusinessId(whatsappId)
  }
}