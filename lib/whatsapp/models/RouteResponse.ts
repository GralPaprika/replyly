export interface Body {
  message: string
}

export interface Init {
  status: number
}

export interface RouteResponse {
  body: Body,
  init: Init,
}