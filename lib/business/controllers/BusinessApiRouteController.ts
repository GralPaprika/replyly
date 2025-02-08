import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";
import {CreateBusinessRequest} from "@/lib/business/models/CreateBusinessRequest";
import {CreateBusinessResponse} from "@/lib/business/models/CreateBusinessResponse";

export class BusinessApiRouteController {
  constructor(private readonly composition: BusinessRouteComposition) {}

  async createBusiness(
    data: CreateBusinessRequest
  ): Promise<CreateBusinessResponse> {
    return await this.composition.provideCreateBusinessUseCase().execute(data);
  }
}