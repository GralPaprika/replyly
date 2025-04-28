import {ValidateFunction} from "ajv";

export class IsValidCreatePlanDtoUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: unknown): boolean {
    return this.validator(data);
  }
}