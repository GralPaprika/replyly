import {NextRequest, NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {HttpHeader} from "@/lib/common/models/HttpHeader";

const apiKey = process.env.API_KEY
const publicApiKey = process.env.NEXT_PUBLIC_API_KEY
const RESPONSE_MESSAGE = 'Unauthorized'

export function apiKeyValidator(request: NextRequest) {
  const requestApiKey = request.headers.get(HttpHeader.XApiKey)
  const headerDebug = request.headers.get(HttpHeader.XDebugKey)

  if (headerDebug && publicApiKey === headerDebug) {
    console.log('Debug mode enabled')
    return NextResponse.next()
  }

  if (!requestApiKey || requestApiKey !== apiKey) {
    return NextResponse.json({error: RESPONSE_MESSAGE}, {status: HttpResponseCode.Unauthorized})
  }
  return NextResponse.next()
}