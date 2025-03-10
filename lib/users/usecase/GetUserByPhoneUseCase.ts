import {UserRepository} from "@/lib/users/models/UserRepository";
import {FindUserDto} from "@/lib/users/models/FindUserDto";

export class GetUserByPhoneUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(phone: string): Promise<FindUserDto | null> {
    return await this.userRepository.getUserByPhone(phone);
  }
}