import {NextRequest, NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";

const API_HEADER = 'x-api-key'
const RESPONSE_MESSAGE = 'Unauthorized'

export function middleware(request: NextRequest) {
  const apiKey = process.env.API_KEY
  const requestApiKey = request.headers.get(API_HEADER)

  if (!requestApiKey || requestApiKey !== apiKey) {
    return NextResponse.json({error: RESPONSE_MESSAGE}, {status: HttpResponseCode.Unauthorized})
  }
  return NextResponse.next()
}
