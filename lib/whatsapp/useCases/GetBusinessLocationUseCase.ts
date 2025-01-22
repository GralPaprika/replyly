import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetBusinessLocationUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  async execute(whatsappId: string): Promise<string> {
    return (await this.whatsappRepository.getBusinessLocationByWhatsappId(whatsappId))
  }
}