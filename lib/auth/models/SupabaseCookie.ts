import {CookieOptions} from "@supabase/ssr/dist/main/types";

export interface SupabaseCookie {
  name: string;
  value: string;
  options: CookieOptions;
}