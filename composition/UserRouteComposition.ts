import {AppComposition} from "@/composition/AppComposition";
import {GetUserByPhoneUseCase} from "@/lib/users/usecase/GetUserByPhoneUseCase";
import {UserRepositoryImpl} from "@/lib/users/UserRepositoryImpl";
import {UserRepository} from "@/lib/users/models/UserRepository";
import {IsValidUserBusinessDtoUseCase} from "@/lib/users/usecase/IsValidUserBusinessDtoUseCase";
import {ValidateFunction} from "ajv";
import {updateUserBusinessDtoSchema} from "@/lib/users/models/UpdateUserBusinessDto";
import {CreateUserUseCase} from "@/lib/users/usecase/CreateUserUseCase";
import {UpdateUserBusinessUseCase} from "@/lib/users/usecase/UpdateUserBusinessUseCase";

export class UserRouteComposition {
  private userRepository!: UserRepository
  private getUserByPhoneUseCase!: GetUserByPhoneUseCase
  private userBusinessDtoValidator!: ValidateFunction
  private isValidUserBusinessDtoUseCase!: IsValidUserBusinessDtoUseCase
  private createUserUseCase!: CreateUserUseCase
  private updateUserBusinessUseCase!: UpdateUserBusinessUseCase

  private constructor(private readonly appCompositionRoot: AppComposition) {}

  static provideInstance(): UserRouteComposition {
    return new UserRouteComposition(AppComposition.getInstance())
  }

  provideUserRepository(): UserRepository {
    return this.userRepository ??= new UserRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  provideGetUserByPhoneUseCase(): GetUserByPhoneUseCase {
    return this.getUserByPhoneUseCase ??= new GetUserByPhoneUseCase(this.provideUserRepository())
  }

  private provideUserBusinessDtoValidator(): ValidateFunction {
    return this.userBusinessDtoValidator ??= this.appCompositionRoot.getAjv().compile(updateUserBusinessDtoSchema)
  }

  provideIsValidUserBusinessDtoUseCase(): IsValidUserBusinessDtoUseCase {
    return this.isValidUserBusinessDtoUseCase ??=
      new IsValidUserBusinessDtoUseCase(this.provideUserBusinessDtoValidator())
  }

  provideCreateUserUseCase(): CreateUserUseCase {
    return this.createUserUseCase ??= new CreateUserUseCase(this.provideUserRepository())
  }

  provideUpdateUserByIdUseCase() {
    return this.updateUserBusinessUseCase ??= new UpdateUserBusinessUseCase(this.provideUserRepository())
  }
}