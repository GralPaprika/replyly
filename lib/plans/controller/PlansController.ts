import {PlansComposition} from "@/composition/PlansComposition";
import {RouteResponse} from "@/lib/plans/models/RouteResponse";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {CreateNetworkDto} from "@/lib/plans/models/network/CreateNetworkDto";
import {AddNetworkToStripeDto} from "@/lib/plans/models/network/AddNetworkToStripeDto";
import {CreatePlanDto} from "@/lib/plans/models/CreatePlanDto";

enum ErrorMessages {
  InvalidData = "Invalid data",
  ServerError = "An error occurred while processing your request.",
}

const BadRequest: RouteResponse = {
  init: {status: HttpResponseCode.BadRequest},
  body: {message: ErrorMessages.InvalidData},
}

const ServerError: RouteResponse = {
  init: {status: HttpResponseCode.ServerError},
  body: {message: ErrorMessages.ServerError},
}

export class PlansController {
  constructor(private readonly composition: PlansComposition) {}

  async addNetwork(dto: CreateNetworkDto): Promise<RouteResponse> {
    if (!this.composition.provideIsValidCreateNetworkDtoUseCase().execute(dto)) {
      return BadRequest
    }

    try {
      const {name} = dto;

      const network = await this.composition.provideCreateNetworkUseCase().execute({name});

      await this.composition.provideSaveNetworkInStripeUseCase().execute({lookup_key: network.id, name: name});

      await this.composition.provideUpdateNetworkIsRegisteredInStripeStatusUseCase().execute(network.id, true);

      return this.successResponse({
        id: network.id,
        name: name,
      })
    } catch (error) {
      console.error(error);
      return ServerError
    }
  }

  async addNetworkToStripe(dto: AddNetworkToStripeDto): Promise<RouteResponse> {
    if (!this.composition.provideIsValidAddNetworkToStripeDtoUseCase().execute(dto)) {
      return BadRequest
    }

    try {
      const {networkId} = dto;
      const {name} = await this.composition.provideGetNetworkByIdUseCase().execute(networkId);

      await this.composition.provideSaveNetworkInStripeUseCase().execute({
        lookup_key: networkId,
        name,
      })

      await this.composition.provideUpdateNetworkIsRegisteredInStripeStatusUseCase().execute(networkId, true);

      return this.successResponse({
        id: networkId,
        name: name,
      })
    } catch (error) {
      // @ts-ignore
      console.error(error.message);
      return ServerError
    }
  }

  async addPlan(dto: CreatePlanDto): Promise<RouteResponse> {
    if (!this.composition.provideIsValidCreatePlanDtoUseCase().execute(dto)) {
      return BadRequest
    }

    try {
      const {id} = await this.composition.provideCreatePlanUseCase().execute(dto);
      const plan = await this.composition.provideGetPlanByIdUseCase().execute(id);
      await this.composition.provideSavePlanInStripeUseCase().execute(plan)

      return this.successResponse(id)
    } catch (error) {
      // @ts-ignore
      console.error(error.message);
      return ServerError
    }
  }

  private successResponse(data: any): RouteResponse {
    return {
      init: {status: HttpResponseCode.Ok},
      body: data,
    }
  }
}