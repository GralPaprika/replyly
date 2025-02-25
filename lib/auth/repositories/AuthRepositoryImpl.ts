import {SupabaseClient} from "@supabase/supabase-js";
import {SupabaseUser} from "@/lib/auth/models/SupabaseUser";
import {AuthRepository, AuthRepositoryException} from "@/lib/auth/models/AuthRepository";
import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";
import {SignedInData} from "@/lib/auth/models/SignedInData";

enum ErrorMessage {
  SignUpError = 'Error signing up',
  MissingUser = 'Missing user id'
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly supabase: SupabaseClient) {}

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

  async signIn(data: SignInRequestSchema): Promise<SignedInData> {
    const result = await this.supabase.auth.signInWithPassword(data)

    if (result.error) {
      console.error(result.error.message)
      throw new AuthRepositoryException(result.error.message)
    }

    if (!result.data.user.user_metadata.replylyUserId) {
      console.error(result.data)
      throw new AuthRepositoryException(ErrorMessage.MissingUser)
    }

    return {
      replylyUserId: result.data.user.user_metadata.replylyUserId,
      userId: result.data.user.id,
      session: {
        accessToken: result.data.session.access_token,
        refreshToken: result.data.session.refresh_token,
        expiresIn: result.data.session.expires_in,
        tokenType: 'bearer',
        expiresAt: result.data.session.expires_at,
      }
    }
  }
}