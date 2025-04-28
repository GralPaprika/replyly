import {AppComposition} from "@/composition/AppComposition";
import Stripe from "stripe";
import {CreateNetworkUseCase} from "@/lib/plans/usecase/network/CreateNetworkUseCase";
import {PlansRepository} from "@/lib/plans/models/PlansRepository";
import {PlansRepositoryImpl} from "@/lib/plans/repository/PlansRepositoryImpl";
import {SaveNetworkInStripeUseCase} from "@/lib/plans/usecase/network/SaveNetworkInStripeUseCase";
import {ValidateFunction} from "ajv";
import {createNetworkDtoSchema} from "@/lib/plans/models/network/CreateNetworkDto";
import {UpdateNetworkIsRegisteredInStripeStatusUseCase} from "@/lib/plans/usecase/network/UpdateNetworkIsRegisteredInStripeStatusUseCase";
import {addNetworkToStripeDtoSchema} from "@/lib/plans/models/network/AddNetworkToStripeDto";
import {IsValidAddNetworkToStripeDtoUseCase} from "@/lib/plans/usecase/network/IsValidAddNetworkToStripeDtoUseCase";
import {IsValidCreateNetworkDtoUseCase} from "@/lib/plans/usecase/network/IsValidCreateNetworkDtoUseCase";
import {GetNetworkByIdUseCase} from "@/lib/plans/usecase/network/GetNetworkByIdUseCase";
import {CreatePlanUseCase} from "@/lib/plans/usecase/CreatePlanUseCase";
import {IsValidCreatePlanDtoUseCase} from "@/lib/plans/usecase/IsValidCreatePlanDtoUseCase";
import {createPlanDtoSchema} from "@/lib/plans/models/CreatePlanDto";
import {GetPlanByIdUseCase} from "@/lib/plans/usecase/GetPlanByIdUseCase";
import {SavePlanInStripeUseCase} from "@/lib/plans/usecase/SavePlanInStripeUseCase";
import {PlanToStripeProductMapper} from "@/lib/plans/mapper/PlanToStripeProductMapper";

export class PlansComposition {
  private stripe!: Stripe;
  private plansRepository!: PlansRepository;
  private createNetworkUseCase!: CreateNetworkUseCase;
  private saveNetworkInStripeUseCase!: SaveNetworkInStripeUseCase;
  private createNetworkDtoValidator!: ValidateFunction;
  private isValidCreateNetworkDtoUseCase!: IsValidCreateNetworkDtoUseCase;
  private updateNetworkIsRegisteredInStripeStatusUseCase!: UpdateNetworkIsRegisteredInStripeStatusUseCase;
  private addNetworkToStripeDtoValidator!: ValidateFunction;
  private isValidAddNetworkToStripeDtoUseCase!: IsValidAddNetworkToStripeDtoUseCase;
  private getNetworkByIdUseCase!: GetNetworkByIdUseCase;
  private createPlanUseCase!: CreatePlanUseCase;
  private createPlanDtoValidator!: ValidateFunction;
  private isValidCreatePlanDtoUseCase!: IsValidCreatePlanDtoUseCase;
  private getPlanByIdUseCase!: GetPlanByIdUseCase;
  private savePlanToStripeUseCase!: SavePlanInStripeUseCase;

  private constructor(private readonly appComposition: AppComposition) {}

  static provideInstance(): PlansComposition {
    return new PlansComposition(AppComposition.getInstance())
  }

  private providePlansRepository(): PlansRepository {
    return this.plansRepository ??= new PlansRepositoryImpl(this.appComposition.getDatabase())
  }

  provideStripe(): Stripe {
    return this.stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { typescript: true })
  }

  provideCreateNetworkUseCase(): CreateNetworkUseCase {
    return this.createNetworkUseCase ??= new CreateNetworkUseCase(this.providePlansRepository())
  }

  provideSaveNetworkInStripeUseCase(): SaveNetworkInStripeUseCase {
    return this.saveNetworkInStripeUseCase ??= new SaveNetworkInStripeUseCase(this.provideStripe())
  }

  private provideCreateNetworkDtoValidator(): ValidateFunction {
    return this.createNetworkDtoValidator ??= this.appComposition.getAjv().compile(createNetworkDtoSchema)
  }

  provideIsValidCreateNetworkDtoUseCase(): IsValidCreateNetworkDtoUseCase {
    return this.isValidCreateNetworkDtoUseCase ??=
      new IsValidCreateNetworkDtoUseCase(this.provideCreateNetworkDtoValidator())
  }

  provideUpdateNetworkIsRegisteredInStripeStatusUseCase(): UpdateNetworkIsRegisteredInStripeStatusUseCase {
    return this.updateNetworkIsRegisteredInStripeStatusUseCase ??=
      new UpdateNetworkIsRegisteredInStripeStatusUseCase(this.providePlansRepository())
  }

  private provideAddNetworkToStripeDtoValidator(): ValidateFunction {
    return this.addNetworkToStripeDtoValidator ??= this.appComposition.getAjv().compile(addNetworkToStripeDtoSchema)
  }

  provideIsValidAddNetworkToStripeDtoUseCase(): IsValidAddNetworkToStripeDtoUseCase {
    return this.isValidAddNetworkToStripeDtoUseCase ??=
      new IsValidAddNetworkToStripeDtoUseCase(this.provideAddNetworkToStripeDtoValidator())
  }

  provideGetNetworkByIdUseCase(): GetNetworkByIdUseCase {
    return this.getNetworkByIdUseCase ??= new GetNetworkByIdUseCase(this.providePlansRepository())
  }

  provideCreatePlanUseCase(): CreatePlanUseCase {
    return this.createPlanUseCase ??= new CreatePlanUseCase(this.providePlansRepository())
  }

  private provideCreatePlanDtoValidator(): ValidateFunction {
    return this.createPlanDtoValidator ??= this.appComposition.getAjv().compile(createPlanDtoSchema)
  }

  provideIsValidCreatePlanDtoUseCase(): IsValidCreatePlanDtoUseCase {
    return this.isValidCreatePlanDtoUseCase ??=
      new IsValidCreatePlanDtoUseCase(this.provideCreatePlanDtoValidator())
  }

  provideGetPlanByIdUseCase(): GetPlanByIdUseCase {
    return this.getPlanByIdUseCase ??= new GetPlanByIdUseCase(this.providePlansRepository())
  }

  private providePlanToStripeProductMapper() {
    return PlanToStripeProductMapper
  }

  provideSavePlanInStripeUseCase(): SavePlanInStripeUseCase {
    return this.savePlanToStripeUseCase ??= new SavePlanInStripeUseCase(
      this.provideStripe(),
      this.providePlanToStripeProductMapper(),
    )
  }
}
