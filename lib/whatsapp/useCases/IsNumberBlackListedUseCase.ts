import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class IsNumberBlackListedUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
  ) {
  }

  async execute(whatsappId: string, number: string): Promise<boolean> {
    // TODO
    return this.whatsappRepository.isNumberBlackListed(whatsappId, number)
  }
}