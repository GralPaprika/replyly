import {BotSecretaryAudioRequest} from "@/lib/whatsapp/models/botsecretary/BotSecretaryAudioRequest";
import {DecodeMediaMessageUseCase} from "@/lib/whatsapp/useCases/DecodeMediaMessageUseCase";
import {BotSecretaryResponse} from "@/lib/whatsapp/models/botsecretary/BotSecretaryResponse";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {AudioType} from "@/lib/util/decode";
import {AudioMessage} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import * as Minio from "minio";
import Path from "path";

export class GetBestResponseFromSecretaryAudioUseCase {
  constructor(
    private readonly repository: WhatsappRepository,
    private readonly decodeMediaMessageUseCase: DecodeMediaMessageUseCase,
    private readonly minio: Minio.Client,
  ) {}

  async execute(userId: string, secretaryId: string, messageId: string, audioData: AudioMessage, destinationPath: string): Promise<BotSecretaryResponse> {
    const business = await this.repository.getBusinessWithWhatsappsFromUser(userId)

    const audioFile = await this.decodeMediaMessageUseCase.execute({
      url: audioData.url,
      mediaKey: audioData.mediaKey,
      mimetype: audioData.mimetype,
      messageType: AudioType.type,
      whatsappTypeMessageToDecode: AudioType.whatsappTypeMessageToDecode,
      filename: `${userId}-${secretaryId}`
    }, destinationPath);

    const path = Path.join(destinationPath, audioFile);

    const objectInfo = await this.minio.fPutObject(
      process.env.MINIO_BUCKET || '',
      messageId,
      path,
      {'Content-Type': audioData.mimetype},
    );

    const url = await this.minio.presignedGetObject(
      process.env.MINIO_BUCKET || '',
      messageId,
    );

    const body: BotSecretaryAudioRequest = {
      userId: userId,
      secretaryId,
      businessId: business.id,
      whatsappIds: business.whatsapps,
      voice: url,
    }

    const response = await fetch(`${process.env.BOT_SERVICE_URL || ''}/secretary`, {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('URL', url)

    return await response.json()
  }
}