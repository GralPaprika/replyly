import {AuthComposition} from "@/composition/AuthComposition";

export class SignInPageController {
  constructor(private readonly composition: AuthComposition) {}

  async signIn(data: {email: string, password: string}) {
    try {
      return await this.composition.provideSignInUseCase().execute(data)
    } catch (e) {
      // @ts-ignore
      throw e.message
    }
  }
}