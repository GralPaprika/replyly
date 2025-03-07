export interface Init {
  status: number;
}

export interface Success {
  message: string;
}

export interface Error {
  error: string;
}

export interface SecretaryNotificationSentResponse {
  init: Init;
  body: Success | Error;
}