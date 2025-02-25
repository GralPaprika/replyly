import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";
import {BusinessData} from "@/lib/business/models/BusinessData";
import {BusinessCreatedData} from "@/lib/business/models/BusinessCreatedData";

export class BusinessApiRouteController {
  constructor(private readonly composition: BusinessRouteComposition) {}

  async createBusiness(
    data: BusinessData
  ): Promise<BusinessCreatedData> {
    return await this.composition.provideCreateBusinessUseCase().execute(data);
  }
}