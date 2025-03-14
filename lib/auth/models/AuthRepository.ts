import {SupabaseUser} from "@/lib/auth/models/SupabaseUser";
import {Exception} from "@/lib/common/models/Exception";
import {SignInRequestSchema} from "@/lib/auth/models/SignInRequestSchema";
import {SignedInData} from "@/lib/auth/models/SignedInData";
import {AuthTokenResponsePassword} from "@supabase/supabase-js";

export class AuthRepositoryException implements Exception {
  constructor(readonly message: string) {}
}

export interface AuthRepository {
  signUp(user: SupabaseUser): Promise<string>
  signIn(data: SignInRequestSchema): Promise<AuthTokenResponsePassword>
}