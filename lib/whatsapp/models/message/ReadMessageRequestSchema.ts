export interface ReadMessageRequestSchema {
  remoteJid: string;
  fromMe: boolean;
  id: string;
}