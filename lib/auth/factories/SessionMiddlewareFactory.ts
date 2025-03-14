import {NextRequest, NextResponse} from "next/server";
import {SupabaseServerClientFactory} from "@/lib/auth/factories/SupabaseServerClientFactory";

export interface Middleware {
  (request: NextRequest): NextResponse
}

export interface SessionMiddlewareFactory {
  create(factory: SupabaseServerClientFactory): Middleware
}