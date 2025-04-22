export interface Body {
  message?: string;
  data?: object
}

export interface Init {
  status: number;
}

export interface RouteResponse {
  body: Body;
  init: Init;
}