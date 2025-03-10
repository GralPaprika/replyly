import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";
import {BusinessData} from "@/lib/business/models/BusinessData";
import {BusinessCreatedData} from "@/lib/business/models/BusinessCreatedData";
import {SlimBusinessDto} from "@/lib/business/models/SlimBusinessDto";

export class BusinessApiRouteController {
  constructor(private readonly composition: BusinessRouteComposition) {}

  async createBusiness(
    data: BusinessData
  ): Promise<BusinessCreatedData> {
    return await this.composition.provideCreateBusinessUseCase().execute(data);
  }

  async getAllBusinesses(): Promise<SlimBusinessDto[]> {
    return await this.composition.provideGetAllBusinessesUseCase().execute();
  }
}