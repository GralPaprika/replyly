export interface SignedInData {
  replylyUserId: string;
  userId: string;
  session: Session;
}

export type TokenType = 'bearer'

export interface Session {
  accessToken: string;
  refreshToken: string;
  tokenType: TokenType;
  expiresIn: number;
  expiresAt?: number;
}