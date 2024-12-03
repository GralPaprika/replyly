import {Exception} from "@/lib/common/models/Exception";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class DeactivatePlanException implements Exception {
  constructor(public readonly message: string) {}
}

export class DeactivatePlanUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Deactivate a plan
   * @param planId
   * @throws {DeactivatePlanException}
   */
  async execute(planId: string): Promise<void> {
    try {
     await this.whatsappRepository.deactivateBusinessPlan(planId)
    } catch (error) {
      // @ts-ignore
      throw new DeactivatePlanException(error.message)
    }
  }
}