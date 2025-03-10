import {UserRouteComposition} from "@/composition/UserRouteComposition";
import {FindUserDto} from "@/lib/users/models/FindUserDto";
import {UpdateUserBusinessDto} from "@/lib/users/models/UpdateUserBusinessDto";
import {UserSchema} from "@/lib/users/models/UserSchema";
import {UserRoles} from "@/lib/common/models/UserRoles";

export class UserRouteController {
  constructor(private readonly composition: UserRouteComposition) {}

  async findUser(phoneNumber: string): Promise<FindUserDto | null> {
    return await this.composition.provideGetUserByPhoneUseCase().execute(phoneNumber)
  }

  isValidUpdateUserBusinessDto(data: any): boolean {
    return this.composition.provideIsValidUserBusinessDtoUseCase().execute(data)
  }

  updateOrCreateUser(data: UpdateUserBusinessDto): Promise<string> {
    if (!data.userId) {
      return this.createUser({
        businessId: data.businessId,
        username: data.phoneNumber,
        phoneNumber: data.phoneNumber,
        name: data.phoneNumber,
        roleId: UserRoles.Admin,
      })
    }

    return this.updateUserById(data.userId, data.businessId)
  }

  private createUser(user: UserSchema): Promise<string> {
    return this.composition.provideCreateUserUseCase().execute(user)
  }

  private updateUserById(userId: string, businessId: string): Promise<string> {
    return this.composition.provideUpdateUserByIdUseCase().execute(userId, businessId)
  }
}