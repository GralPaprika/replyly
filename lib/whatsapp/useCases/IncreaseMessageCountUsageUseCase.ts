import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {Exception} from "@/lib/common/models/Exception";

export class IncreaseMessageCountUsageException implements Exception {
  constructor(public readonly message: string) {}
}

export class IncreaseMessageCountUsageUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  async execute(whatsappId: string, amount: number): Promise<void> {
    try {
      await this.whatsappRepository.increaseMessageCountUsage(whatsappId, amount)
    } catch (error) {
      // @ts-ignore
      throw new IncreaseMessageCountUsageException(error.message)
    }
  }
}