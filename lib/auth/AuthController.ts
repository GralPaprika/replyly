import { AuthComposition } from "@/composition/AuthComposition";
import {BusinessData} from "@/lib/auth/models/BusinessData";
import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {SignInUseCaseException} from "@/lib/auth/usecases/SignInUseCase";

enum ResponseMessage {
  InvalidData = 'Invalid data',
  Error = 'Error',
}

export class AuthController {
  constructor(private readonly authComposition: AuthComposition) {}

  async signUp(data: BusinessData) {
    const result = this.isValidSignUpData(data)
    if (!result.isValid) {
      return {
        body: {
          error: ResponseMessage.InvalidData,
          message: result.error,
        },
        init: {status: HttpResponseCode.BadRequest},
      }
    }

    try {
      const userId = await this.authComposition.provideSignUpUseCase().execute(data)
      return {
        body: {userId},
        init: {status: HttpResponseCode.Ok},
      }
    } catch (e) {
      if (e instanceof SignInUseCaseException) {
        return {
          body: {error: e.message},
          init: {status: HttpResponseCode.BadRequest},
        }
      }
      return {
        body: {error: ResponseMessage.Error},
        init: {status: HttpResponseCode.BadRequest},
      }
    }
  }

  async signIn(data: SignInRequestSchema) {
    try {
      const result = await this.authComposition.provideSignInUseCase().execute(data)
      return {
        body: result,
        init: {status: HttpResponseCode.Ok},
      }
    } catch (e) {
      if (e instanceof SignInUseCaseException) {
        return {
          body: {error: ResponseMessage.Error},
          init: {status: HttpResponseCode.BadRequest},
        }
      }

      return {
        body: {error: ResponseMessage.Error},
        init: {status: HttpResponseCode.ServerError},
      }
    }
  }

  private isValidSignUpData(data: BusinessData) {
    return this.authComposition.provideIsValidSignUpDataUseCase().execute(data)
  }
}