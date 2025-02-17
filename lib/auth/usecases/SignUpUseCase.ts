import {SupabaseClient} from "@supabase/supabase-js";
import {SignUpRequestSchema} from "@/lib/auth/models/SignUpRequestSchema";

export class SignUpUseCase {
  constructor(private readonly supabase: SupabaseClient) {}

  async execute(data: SignUpRequestSchema) {
    return await this.supabase.auth.signUp({
      email: data.email,
      password: data.password
    })
  }
}