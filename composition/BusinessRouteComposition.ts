import {AppComposition} from "@/composition/AppComposition";
import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessRepositoryImpl} from "@/lib/business/repositories/BusinessRepositoryImpl";
import {CreateBusinessUseCase} from "@/lib/business/usecases/CreateBusinessUseCase";
import {GetAllBusinessesUseCase} from "@/lib/business/usecases/GetAllBusinessesUseCase";

export class BusinessRouteComposition {
  private businessRepository!: BusinessRepository
  private createBusinessUseCase!: CreateBusinessUseCase
  private getAllBusinessUseCase!: GetAllBusinessesUseCase

  private constructor(private readonly appCompositionRoot: AppComposition) {}

  static provideInstance(): BusinessRouteComposition {
    return new BusinessRouteComposition(AppComposition.getInstance())
  }

  private provideBusinessRepository(): BusinessRepository {
    return this.businessRepository ??= new BusinessRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  provideCreateBusinessUseCase(): CreateBusinessUseCase {
    return this.createBusinessUseCase ??= new CreateBusinessUseCase(this.provideBusinessRepository())
  }

  provideGetAllBusinessesUseCase(): GetAllBusinessesUseCase {
    return this.getAllBusinessUseCase ??= new GetAllBusinessesUseCase(this.provideBusinessRepository())
  }
}