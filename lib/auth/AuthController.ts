import { AuthComposition } from "@/composition/AuthComposition";
import {SignUpRequestSchema} from "@/lib/auth/models/SignUpRequestSchema";

export class AuthController {
  constructor(private readonly authComposition: AuthComposition) {}

  async signUp(data: SignUpRequestSchema) {
    const result = await this.authComposition.provideSignUpUseCase().execute(data)
    console.log('sign up result', result)
    return result
  }
}