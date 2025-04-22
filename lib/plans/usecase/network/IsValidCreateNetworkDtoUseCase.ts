import {ValidateFunction} from "ajv";
import {CreateNetworkDto} from "@/lib/plans/models/network/CreateNetworkDto";

export class IsValidCreateNetworkDtoUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: CreateNetworkDto): boolean {
    return this.validator(data)
  }
}