import {UserRepository} from "@/lib/users/models/UserRepository";
import {UserSchema} from "@/lib/users/models/UserSchema";

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(data: UserSchema) {
    return await this.repository.createUser(data)
  }
}