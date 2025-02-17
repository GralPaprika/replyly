import {AppComposition} from "@/composition/AppComposition";
import {SignUpUseCase} from "@/lib/auth/usecases/SignUpUseCase";

export class AuthComposition {
  private readonly appCompositionRoot: AppComposition
  private signUpUseCase!: SignUpUseCase

  private constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): AuthComposition {
    return new AuthComposition(AppComposition.getInstance())
  }

  private provideSupabaseClient() {
    return this.appCompositionRoot.getSupabaseClient()
  }

  provideSignUpUseCase() {
    return this.signUpUseCase ??= new SignUpUseCase(this.provideSupabaseClient())
  }
}