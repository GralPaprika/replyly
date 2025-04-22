import {ValidateFunction} from "ajv";
import {AddNetworkToStripeDto} from "@/lib/plans/models/network/AddNetworkToStripeDto";

export class IsValidAddNetworkToStripeDtoUseCase {
  constructor(private readonly validator: ValidateFunction) {}

  execute(data: AddNetworkToStripeDto): boolean {
    return this.validator(data)
  }
}