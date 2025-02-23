import { AuthComposition } from "@/composition/AuthComposition";
import {SignUpRequestSchema} from "@/lib/auth/models/SignUpRequestSchema";
import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";

export class AuthController {
  constructor(private readonly authComposition: AuthComposition) {}

  async signUp(data: SignUpRequestSchema) {
    const result = await this.authComposition.provideSignUpUseCase().execute(data)
    console.log('sign up result', result)
    return result
  }

  async signIn(data: SignInRequestSchema) {
    const result = await this.authComposition.provideSignInUseCase().execute(data)
    console.log('sign up result', result)
    return result
  }
}