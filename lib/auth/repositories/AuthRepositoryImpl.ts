import {AuthTokenResponsePassword, SupabaseClient} from "@supabase/supabase-js";
import {SupabaseUser} from "@/lib/auth/models/SupabaseUser";
import {AuthRepository, AuthRepositoryException} from "@/lib/auth/models/AuthRepository";
import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";
import {SupabaseServerClientFactory} from "@/lib/auth/factories/SupabaseServerClientFactory";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {SupabaseCookie} from "@/lib/auth/models/SupabaseCookie";

enum ErrorMessage {
  SignUpError = 'Error signing up',
  MissingUser = 'Missing user id'
}

export class AuthRepositoryImpl implements AuthRepository {
  private readonly supabaseServerClient: SupabaseClient

  constructor(
    private readonly supabase: SupabaseClient,
    cookies: ReadonlyRequestCookies,
    serverClientFactory: SupabaseServerClientFactory,
  ) {
    const getAllCookies = () => cookies.getAll()
    const setAllCookies =  (cookiesToSet: SupabaseCookie[]) => cookiesToSet.forEach(
      ({name, value, options}) => cookies.set(name, value, options)
    )

    this.supabaseServerClient = serverClientFactory.create(getAllCookies, setAllCookies)
  }

  async signUp(user: SupabaseUser): Promise<string> {
    const result = await this.supabase.auth.signUp(user)

    if (result.error) {
      console.error(result.error.message)
      throw new AuthRepositoryException(ErrorMessage.SignUpError)
    }

    if (!result.data.user) {
      console.error(result.data.user)
      throw new AuthRepositoryException(ErrorMessage.SignUpError)
    }

    return result.data.user.id
  }

  async signIn(data: SignInRequestSchema): Promise<AuthTokenResponsePassword> {
    const authToken = await this.supabaseServerClient.auth.signInWithPassword(data)

    if (authToken.error) {
      console.error(authToken.error.message)
      throw new AuthRepositoryException(authToken.error.message)
    }

    if (!authToken.data.user.user_metadata.replylyUserId) {
      console.error(authToken.data)
      throw new AuthRepositoryException(ErrorMessage.MissingUser)
    }

    return authToken
  }
}