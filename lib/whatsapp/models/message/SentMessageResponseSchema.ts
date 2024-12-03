export interface Text {
  body: string;
}

export interface Message {
  id: string;
  from_me: boolean;
  type: string;
  chat_id: string;
  timestamp: number;
  source: string;
  device_id: number;
  status: string;
  text: Text;
  from: string;
}

export interface SentMessageResponseSchema {
  sent: boolean;
  message: Message;
}