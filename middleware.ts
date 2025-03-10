import {NextRequest, NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";

const API_HEADER = 'x-api-key'
const DEBUG_HEADER = 'x-debug-key'
const RESPONSE_MESSAGE = 'Unauthorized'

export function middleware(request: NextRequest) {
  const apiKey = process.env.API_KEY
  const publicApiKey = process.env.NEXT_PUBLIC_API_KEY
  const requestApiKey = request.headers.get(API_HEADER)
  const headerDebug = request.headers.get(DEBUG_HEADER)

  if (headerDebug && publicApiKey === headerDebug) {
    console.log('Debug mode enabled')
    return NextResponse.next()
  }

  if (!requestApiKey || requestApiKey !== apiKey) {
    return NextResponse.json({error: RESPONSE_MESSAGE}, {status: HttpResponseCode.Unauthorized})
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}