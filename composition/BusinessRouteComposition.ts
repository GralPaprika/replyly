import {AppComposition} from "@/composition/AppComposition";
import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessRepositoryImpl} from "@/lib/business/repositories/BusinessRepositoryImpl";
import {CreateBusinessUseCase} from "@/lib/usecases/CreateBusinessUseCase";

export class BusinessRouteComposition {
  private readonly appCompositionRoot: AppComposition
  private businessRepository!: BusinessRepository
  private createBusinessUseCase!: CreateBusinessUseCase

  constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): BusinessRouteComposition {
    return new BusinessRouteComposition(AppComposition.getInstance())
  }

  private provideBusinessRepository(): BusinessRepository {
    return this.businessRepository ??= new BusinessRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  provideCreateBusinessUseCase(): CreateBusinessUseCase {
    return this.createBusinessUseCase ??= new CreateBusinessUseCase(this.provideBusinessRepository())
  }
}