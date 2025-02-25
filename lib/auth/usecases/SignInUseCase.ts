import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";
import {AuthRepository, AuthRepositoryException} from "@/lib/auth/models/AuthRepository";
import {Exception} from "@/lib/common/models/Exception";

export class SignInUseCaseException implements Exception {
  constructor(readonly message: string) {}
}

export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(data: SignInRequestSchema) {
    try {
      return await this.authRepository.signIn(data)
    } catch (e) {
      if (e instanceof AuthRepositoryException) {
        throw new SignInUseCaseException(e.message)
      }
      throw new Error("Unexpected sign up error")
    }
  }
}