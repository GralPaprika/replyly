import {UserRepository} from "@/lib/users/models/UserRepository";

export class UpdateUserBusinessUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, businessId: string): Promise<string> {
    return await this.userRepository.updateUserBusiness(userId, businessId)
  }
}