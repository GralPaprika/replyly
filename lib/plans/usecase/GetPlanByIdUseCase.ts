import {PlansRepository} from "@/lib/plans/models/PlansRepository";
import {Plan} from "@/lib/plans/models/Plan";
import {Exception} from "@/lib/common/models/Exception";

export class GetPlanByIdException implements Exception {
  constructor(readonly message: string) {}
}

enum ErrorMessage {
  PlanNotFound = 'Plan not found',
}

export class GetPlanByIdUseCase {
  constructor(private readonly repository: PlansRepository) {}

  async execute(id: string): Promise<Plan> {
    const plan = await this.repository.getPlanById(id);

    if (!plan) {
      throw new GetPlanByIdException(ErrorMessage.PlanNotFound);
    }

    return plan;
  }
}