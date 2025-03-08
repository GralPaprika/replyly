import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {AudioMessage} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {DecodeMediaMessageUseCase} from "@/lib/whatsapp/useCases/DecodeMediaMessageUseCase";
import {AudioType} from "@/lib/util/decode";
import {BotAudioWebhookRequest} from "@/lib/whatsapp/models/botservice/BotAudioWebhookRequest";
import * as Minio from 'minio'

export class GetBestResponseForAudioUseCase {
  constructor(
    private readonly decodeMediaMessageUseCase: DecodeMediaMessageUseCase,
    private readonly minio: Minio.Client,
  ) {}

  async execute(
    conversationId: string,
    audioData: AudioMessage,
    messageId: string,
    destinationPath: string,
    chatId: string,
    whatsappId: string,
    businessId: string,
  ): Promise<string> {
    const audioFile = await this.decodeMediaMessageUseCase.execute({
      url: audioData.url,
      mediaKey: audioData.mediaKey,
      mimetype: audioData.mimetype,
      messageType: AudioType.type,
      whatsappTypeMessageToDecode: AudioType.whatsappTypeMessageToDecode,
      filename: `${conversationId}-${messageId}`
    }, destinationPath);

    const objectInfo = await this.minio.fPutObject(
      process.env.MINIO_BUCKET || '',
      messageId,
      audioFile,
      {'Content-Type': audioData.mimetype},
    );

    const url = await this.minio.presignedGetObject(
      process.env.MINIO_BUCKET || '',
      messageId,
    );

    const body: BotAudioWebhookRequest = {
      businessId,
      chatId,
      whatsappId,
      voice: url
    }

    const response = await fetch(process.env.BOT_SERVICE_URL || '', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('URL', url)

    return await response.text()
  }
}