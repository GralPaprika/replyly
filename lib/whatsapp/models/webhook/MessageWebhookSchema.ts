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
  chat_name: string;
  text: Text;
  from: string;
  from_name: string;
}

export interface Event {
  type: string;
  event: string;
}

export interface MessageWebhookSchema {
  messages: Message[];
  event: Event;
  channel_id: string;
}