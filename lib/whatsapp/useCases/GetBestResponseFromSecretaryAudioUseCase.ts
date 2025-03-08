import {BotSecretaryAudioRequest} from "@/lib/whatsapp/models/botsecretary/BotSecretaryAudioRequest";
import {DecodeMediaMessageUseCase} from "@/lib/whatsapp/useCases/DecodeMediaMessageUseCase";
import {BotSecretaryResponse} from "@/lib/whatsapp/models/botsecretary/BotSecretaryResponse";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {AudioType} from "@/lib/util/decode";
import {AudioMessage} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {DeleteDecodedFileUseCase} from "@/lib/whatsapp/useCases/DeleteDecodedFileUseCase";

export class GetBestResponseFromSecretaryAudioUseCase {
  constructor(
    private readonly repository: WhatsappRepository,
    private readonly decodeMediaMessageUseCase: DecodeMediaMessageUseCase,
    private readonly deleteDecodedFileUseCase: DeleteDecodedFileUseCase,
  ) {}

  async execute(userId: string, secretaryId: string, audioData: AudioMessage, destinationPath: string): Promise<BotSecretaryResponse> {
    const business = await this.repository.getBusinessWithWhatsappsFromUser(userId)
    const url = process.env.BOT_SERVICE_URL || '';
    const serverName = process.env.SERVER_URL || '';

    const audioFile = await this.decodeMediaMessageUseCase.execute({
      url: audioData.url,
      mediaKey: audioData.mediaKey,
      mimetype: audioData.mimetype,
      messageType: AudioType.type,
      whatsappTypeMessageToDecode: AudioType.whatsappTypeMessageToDecode,
      filename: `${userId}-${secretaryId}`
    }, destinationPath);

    const body: BotSecretaryAudioRequest = {
      userId: userId,
      secretaryId,
      businessId: business.id,
      whatsappIds: business.whatsapps,
      voice: `${serverName}/api/public/whatsapp/audio/${audioFile}`,
    }

    const response = await fetch(`${url}/secretary`, {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('URL', `${serverName}/api/public/whatsapp/audio/${audioFile}`)

    // this.deleteDecodedFileUseCase.execute(`./public/whatsapp/audio/${audioFile}`);

    return await response.json()
  }
}