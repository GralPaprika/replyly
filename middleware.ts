import {NextRequest, NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {apiKeyValidator} from "@/lib/middlewares/apiKeyValidator";

class Route {
  static Api: Route = new Route('/api/:path*', '/api')
  static UserQr: Route = new Route('/user/qr/', '/user/qr')
  private constructor(readonly matcher: string, readonly pathname: string) {}
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(Route.Api.pathname)) {
    return apiKeyValidator(request)
  }
  else if (request.nextUrl.pathname.startsWith(Route.UserQr.pathname)) {
    return apiKeyValidator(request)
  }
  else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [Route.Api.matcher, Route.UserQr.matcher],
}