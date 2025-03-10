import {UpdateUserBusinessDto} from "@/lib/users/models/UpdateUserBusinessDto";
import {ValidateFunction} from "ajv";

export class IsValidUserBusinessDtoUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: UpdateUserBusinessDto): boolean {
    return this.validator(data)
  }
}