
import {DeactivatePlanException, DeactivatePlanUseCase} from "@/lib/whatsapp/useCases/DeactivatePlanUseCase";
import {Exception} from "@/lib/common/models/Exception";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

enum ErrorMessage {
  NoActivePlan = 'No active plan found',
  PlanExpired = 'Plan expired',
}

enum ErrorCode {
  NoActivePlan,
  PlanExpired,
  SystemError,
}

export class HasActivePlanException implements Exception {
  static ErrorCode = ErrorCode

  constructor(public readonly message: string, public readonly code: ErrorCode) {}
}

export class HasActivePlanUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
    private readonly deactivatePlanUseCase: DeactivatePlanUseCase,
  ) {}

  /**
   * Check if a whatsappId has an active plan
   * @param whatsappId
   * @returns {Promise<boolean>}
   * @throws {HasActivePlanException}
   */
  async execute(whatsappId: string): Promise<boolean> {
    try {
      const plans = await this.whatsappRepository.getPlansByWhatsappId(whatsappId)
      if (plans.length === 0) {
        return Promise.reject(new HasActivePlanException(ErrorMessage.NoActivePlan.valueOf(), ErrorCode.NoActivePlan))
      }

      const plan = plans[0]
      const now = new Date()
      if (now > plan.endDate) {
        await this.deactivatePlanUseCase.execute(plan.planId)
        return Promise.reject(new HasActivePlanException(ErrorMessage.PlanExpired.valueOf(), ErrorCode.PlanExpired))
      }

      return true
    } catch (error) {
      if (error instanceof DeactivatePlanException) {
        throw new HasActivePlanException(error.message, ErrorCode.SystemError)
      }

      // @ts-ignore
      throw new HasActivePlanException(error.message, ErrorCode.SystemError)
    }
  }
}