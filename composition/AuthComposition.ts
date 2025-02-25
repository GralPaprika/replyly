import {AppComposition} from "@/composition/AppComposition";
import {SignUpUseCase} from "@/lib/auth/usecases/SignUpUseCase";
import {SignInUseCase} from "@/lib/auth/usecases/SignInUseCase";
import {AuthRepository} from "@/lib/auth/models/AuthRepository";
import {AuthRepositoryImpl} from "@/lib/auth/repositories/AuthRepositoryImpl";
import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessRepositoryImpl} from "@/lib/business/repositories/BusinessRepositoryImpl";
import {CreateBusinessUseCase} from "@/lib/business/usecases/CreateBusinessUseCase";
import {IsValidSignUpDataUseCase} from "@/lib/auth/usecases/IsValidSignUpDataUseCase";
import {businessDataSchema} from "@/lib/auth/models/BusinessData";
import {ValidateFunction} from "ajv";

export class AuthComposition {
  private readonly appCompositionRoot: AppComposition
  private authRepository!: AuthRepository
  private businessRepository!: BusinessRepository
  private businessDataValidator!: ValidateFunction
  private signUpUseCase!: SignUpUseCase
  private signInUseCase!: SignInUseCase
  private createBusinessUseCase!: CreateBusinessUseCase
  private isValidSignUpDataUseCase!: IsValidSignUpDataUseCase


  private constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): AuthComposition {
    return new AuthComposition(AppComposition.getInstance())
  }

  private provideSupabaseClient() {
    return this.appCompositionRoot.getSupabaseClient()
  }

  private provideAuthRepository() {
    return this.authRepository ??= new AuthRepositoryImpl(this.provideSupabaseClient())
  }

  private provideBusinessRepository() {
    return this.businessRepository ??= new BusinessRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideCreateBusinessUseCase() {
    return this.createBusinessUseCase ??= new CreateBusinessUseCase(this.provideBusinessRepository())
  }

  private provideBusinessDataValidator() {
    return this.businessDataValidator ??= this.appCompositionRoot.getAjv().compile(businessDataSchema)
  }

  provideIsValidSignUpDataUseCase() {
    return this.isValidSignUpDataUseCase ??= new IsValidSignUpDataUseCase(this.provideBusinessDataValidator())
  }

  provideSignUpUseCase() {
    return this.signUpUseCase ??= new SignUpUseCase(
      this.provideAuthRepository(),
      this.provideCreateBusinessUseCase(),
    )
  }

  provideSignInUseCase() {
    return this.signInUseCase ??= new SignInUseCase(this.provideAuthRepository())
  }
}