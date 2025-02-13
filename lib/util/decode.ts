import * as crypto from 'crypto';
import axios from 'axios';
import * as fs from 'fs';
import * as Path from 'path';
import * as mime from 'mime-types';

export type MessageType = 'audioMessage'
export type WhatsappTypeMessageToDecode = 'WhatsApp Audio Keys'

export interface MessageTypeMetadata {
  readonly type: MessageType;
  readonly whatsappTypeMessageToDecode: WhatsappTypeMessageToDecode
}

export const AudioType: MessageTypeMetadata = {
  type: 'audioMessage',
  whatsappTypeMessageToDecode: 'WhatsApp Audio Keys'
};

export interface Payload {
  readonly url: string;
  readonly mediaKey: string;
  readonly messageType: MessageType;
  readonly whatsappTypeMessageToDecode: WhatsappTypeMessageToDecode;
  readonly mimetype: string;
  readonly filename?: string;
}

const ENC_FILE_EXTENSION = 'enc';
const HKDF_ALGORITHM = 'sha256';
const AES_DECRYPT_ALGORITHM = 'aes-256-cbc';

export async function downloadUsingEncLink(payload: Payload, destinationPath: string): Promise<string> {
  let filename = payload.filename || crypto.randomBytes(16).toString('hex');
  const mediaKey = payload.mediaKey;
  const url = payload.url;
  const messageType = payload.messageType;
  const whatsappTypeMessageToDecode = payload.whatsappTypeMessageToDecode;
  const mimetype = payload.mimetype.split(';')[0];
  const fileExtension = mime.extension(mimetype) || '';
  const completeFilename = `${filename}.${fileExtension}`;

  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const encFilePath = Path.join(destinationPath, `${filename}.${ENC_FILE_EXTENSION}`);
  fs.writeFileSync(encFilePath, response.data);

  const mediaKeyExpanded = HKDF(Buffer.from(mediaKey, 'base64'), 112, Buffer.from(whatsappTypeMessageToDecode, 'utf-8'));
  const mediaData = fs.readFileSync(encFilePath);
  const file = mediaData.slice(0, -10);
  const fileDataDecoded = AESDecrypt(mediaKeyExpanded.slice(16, 48), file, mediaKeyExpanded.slice(0, 16));

  const decodedFilePath = Path.join(destinationPath, completeFilename);
  fs.writeFileSync(decodedFilePath, fileDataDecoded);

  return completeFilename;
}

function HKDF(key: Buffer, length: number, appInfo: Buffer = Buffer.alloc(0)): Buffer {
  const prk = crypto.createHmac(HKDF_ALGORITHM, Buffer.alloc(32)).update(key).digest();
  let keyStream = Buffer.alloc(0);
  let keyBlock: Buffer = Buffer.alloc(0);
  let blockIndex = 1;
  while (keyStream.length < length) {
    keyBlock = crypto.createHmac(HKDF_ALGORITHM, prk).update(Buffer.concat([keyBlock, appInfo, Buffer.from([blockIndex])])).digest();
    blockIndex += 1;
    keyStream = Buffer.concat([keyStream, keyBlock]);
  }
  return keyStream.slice(0, length);
}

function AESUnpad(buffer: Buffer): Buffer {
  const padding = buffer[buffer.length - 1];
  return buffer.slice(0, -padding);
}

function AESDecrypt(key: Buffer, ciphertext: Buffer, iv: Buffer): Buffer {
  const decipher = crypto.createDecipheriv(AES_DECRYPT_ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return AESUnpad(decrypted);
}