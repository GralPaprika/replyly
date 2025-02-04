import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";
import {BusinessSchema} from "@/lib/business/models/BusinessSchema";

export class BusinessApiRouteController {
  constructor(private readonly composition: BusinessRouteComposition) {}

  async createBusiness(
    data: BusinessSchema
  ): Promise<string> {
    return await this.composition.provideCreateBusinessUseCase().createBusiness(data);
  }
}