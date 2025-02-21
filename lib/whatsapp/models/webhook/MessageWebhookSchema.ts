export interface DisappearingMode {
  initiator?: string;
  trigger?: string;
  initiatedByMe?: boolean;
}

export interface ContextInfo {
  expiration?: number;
  ephemeralSettingTimestamp?: string;
  disappearingMode?: DisappearingMode;
  mentionedJid?: string[];
  entryPointConversionSource?: string;
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

export interface EphemeralMessage {
  message: MessageContent;
}

export interface ProtocolMessageKey {
  remoteJid: string;
  fromMe: boolean;
}

export interface ProtocolMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
  };
  type: string;
  ephemeralExpiration: number;
  ephemeralSettingTimestamp: string;
  disappearingMode: DisappearingMode;
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

export interface AudioMessage {
  url: string;
  mimetype: string;
  fileSha256: string;
  fileLength: string;
  seconds: number;
  ptt: boolean;
  mediaKey: string;
  fileEncSha256: string;
  directPath: string;
  contextInfo?: ContextInfo;
  streamingSidecar?: string;
  mediaKeyTimestamp: string;
  waveform: string;
}

export interface MessageContent {
  conversation?: string;
  protocolMessage?: ProtocolMessage;
  extendedTextMessage?: ExtendedTextMessage;
  messageContextInfo?: MessageContextInfo;
  ephemeralMessage?: EphemeralMessage;
  stickerMessage?: StickerMessage;
  senderKeyDistributionMessage?: SenderKeyDistributionMessage;
  reactionMessage?: ReactionMessage;
  audioMessage?: AudioMessage;
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