export interface DisappearingMode {
  initiator?: string;
  trigger?: string;
  initiatedByMe: boolean;
}

export interface ContextInfo {
  expiration?: number;
  ephemeralSettingTimestamp?: string;
  disappearingMode?: DisappearingMode;
  mentionedJid?: string[];
}

export interface ExtendedTextMessage {
  text: string;
  previewType?: string;
  contextInfo: ContextInfo;
  inviteLinkGroupTypeV2?: string;
}

export interface DeviceListMetadata {
  senderKeyHash: string;
  senderTimestamp: string;
  recipientKeyHash: string;
  recipientTimestamp: string;
}

export interface MessageContextInfo {
  messageSecret: string;
  deviceListMetadata?: DeviceListMetadata;
  deviceListMetadataVersion?: number;
}

export interface StickerMessage {
  url: string;
  fileSha256: string;
  fileEncSha256: string;
  mediaKey: string;
  mimetype: string;
  height: number;
  width: number;
  directPath: string;
  fileLength: string;
  mediaKeyTimestamp: string;
  isAnimated: boolean;
  stickerSentTs: string;
  isAvatar: boolean;
  isAiSticker: boolean;
  isLottie: boolean;
}

export interface SenderKeyDistributionMessage {
  groupId: string;
  axolotlSenderKeyDistributionMessage: string;
}

export interface ReactionMessage {
  key: Key;
  text: string;
  senderTimestampMs: string;
}

export interface MessageContent {
  conversation?: string;
  extendedTextMessage?: ExtendedTextMessage;
  messageContextInfo: MessageContextInfo;
  stickerMessage?: StickerMessage;
  senderKeyDistributionMessage?: SenderKeyDistributionMessage;
  reactionMessage?: ReactionMessage;
}

export interface Key {
  remoteJid: string;
  fromMe: boolean;
  id: string;
  participant?: string;
}

export interface Messages {
  key: Key;
  messageTimestamp: number;
  pushName: string;
  broadcast: boolean;
  status?: number;
  message: MessageContent;
  verifiedBizName?: string;
  sentFromServer: boolean;
}

export interface Data {
  messages: Messages;
}

export interface MessageWebhookSchema {
  sessionId: string;
  event: string;
  data: Data;
  status: string;
}