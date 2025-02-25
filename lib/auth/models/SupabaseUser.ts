export interface SupabaseUser {
  email: string;
  password: string;
  options?: Options;
}

export type Channel = 'sms' | 'whatsapp';

export interface Options {
  captchaToken?: string;
  channel?: Channel;
  data?: Data;
}

export interface Data {
  replylyUserId: string;
}