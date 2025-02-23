import {SupabaseClient} from "@supabase/supabase-js";
import {SignUpRequestSchema} from "@/lib/auth/models/SignUpRequestSchema";

export class SignInUseCase {
  constructor(private readonly supabase: SupabaseClient) {}

  async execute(data: SignUpRequestSchema) {
    return await this.supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
  }
}