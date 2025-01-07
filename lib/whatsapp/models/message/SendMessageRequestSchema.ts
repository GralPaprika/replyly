type MessageType = 'group' | 'number'

export interface Message {
  text: string,
}

export interface SendMessageRequestSchema {
  jid: string
  type: MessageType
  message: Message
}