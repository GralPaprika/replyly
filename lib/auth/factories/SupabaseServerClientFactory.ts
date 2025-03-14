import {SupabaseClient} from "@supabase/supabase-js";
import {GetAllCookies, SetAllCookies} from "@supabase/ssr";

export interface SupabaseServerClientFactory {
  create(getAll: GetAllCookies, setAll: SetAllCookies): SupabaseClient
}