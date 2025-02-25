import {BusinessData} from "@/lib/auth/models/BusinessData";
import {AuthRepository, AuthRepositoryException} from "@/lib/auth/models/AuthRepository";
import {CreateBusinessUseCase, CreateBusinessUseCaseException} from "@/lib/business/usecases/CreateBusinessUseCase";
import {Exception} from "@/lib/common/models/Exception";

export class SignUpUseCaseException implements Exception {
  constructor(readonly message: string) {}
}

export class SignUpUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly createBusinessUseCase: CreateBusinessUseCase
  ) {}

  async execute(data: BusinessData) {
    try {
      const { userId } = await this.createBusinessUseCase.execute(data)

      return await this.authRepository.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            replylyUserId: userId
          }
        },
      })
    } catch (e) {
      if (e instanceof CreateBusinessUseCaseException) {
        console.error("Error creating business")
        throw new SignUpUseCaseException(e.message)
      }
      else if (e instanceof AuthRepositoryException) {
        console.error("Error creating user")
        throw new SignUpUseCaseException(e.message)
      }
      throw new Error("Unexpected sign up error")
    }
  }
}