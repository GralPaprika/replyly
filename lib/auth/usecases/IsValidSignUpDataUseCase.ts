import {ValidateFunction} from "ajv";
import {BusinessData} from "@/lib/auth/models/BusinessData";
import {ValidateResult} from "@/lib/common/models/ValidateResult";

export class IsValidSignUpDataUseCase {
  constructor(private readonly validate: ValidateFunction) {}

  execute(data: BusinessData): ValidateResult {
    const result = this.validate(data)

    if (result)
      return { isValid: result }

    const error = this.validate.errors?.[0].message ?? ''
    return { isValid: result, error }
  }
}