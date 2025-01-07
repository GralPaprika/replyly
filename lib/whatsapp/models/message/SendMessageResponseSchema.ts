export interface Key {
  remoteJid: string;
  fromMe: boolean;
  id: string;
}

export interface ExtendedTextMessage {
  text: string;
}

export interface Message {
  extendedTextMessage: ExtendedTextMessage;
}

export interface SendMessageResponseSchema {
  key: Key;
  message: Message;
  messageTimestamp: string;
  status: string;
}