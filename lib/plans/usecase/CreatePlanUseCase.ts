import {PlansRepository} from "@/lib/plans/models/PlansRepository";
import {CreatePlanDto} from "@/lib/plans/models/CreatePlanDto";
import { Exception } from "@/lib/common/models/Exception";

export class CreatePlanException implements Exception {
  constructor(readonly message: string) {}
}

export class CreatePlanUseCase {
  constructor(private readonly repository: PlansRepository) {}

  async execute(data: CreatePlanDto): Promise<{id: string}> {

    try {
      const plan = await this.repository.createPlan(data);
      return { id: plan.id };
    } catch (error) {
      // @ts-ignore
      throw new CreatePlanException(error.message);
    }
  }
}