import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class IsNumberBlackListedUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
  ) {}

  async execute(whatsappId: string, contactId: string): Promise<boolean> {
    return this.whatsappRepository.isNumberBlackListed(whatsappId, contactId)
  }
}