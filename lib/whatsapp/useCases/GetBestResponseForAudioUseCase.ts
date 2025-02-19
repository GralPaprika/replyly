import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {AudioMessage} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {DecodeMediaMessageUseCase} from "@/lib/whatsapp/useCases/DecodeMediaMessageUseCase";
import {AudioType} from "@/lib/util/decode";
import {DeleteDecodedFileUseCase} from "@/lib/whatsapp/useCases/DeleteDecodedFileUseCase";

export class GetBestResponseForAudioUseCase {
  constructor(
    private readonly decodeMediaMessageUseCase: DecodeMediaMessageUseCase,
    private readonly deleteDecodedFileUseCase: DeleteDecodedFileUseCase,
  ) {}

  async execute(
    conversationId: string,
    messageId: string,
    audioData: AudioMessage,
    destinationPath: string,
    chatId: string,
    whatsappId: string
  ): Promise<string> {
    const audioFile = await this.decodeMediaMessageUseCase.execute({
      url: audioData.url,
      mediaKey: audioData.mediaKey,
      mimetype: audioData.mimetype,
      messageType: AudioType.type,
      whatsappTypeMessageToDecode: AudioType.whatsappTypeMessageToDecode,
      filename: `${conversationId}-${messageId}`
    }, destinationPath);

    const serverName = process.env.SERVER_URL || '';

    const response = await fetch(process.env.BOT_SERVICE_URL || '', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        whatsappId: whatsappId,
        voice: `${serverName}/api/public/whatsapp/audio/${audioFile}`
      })
    });

    console.log('URL', `${serverName}/api/public/whatsapp/audio/${audioFile}`)

    // this.deleteDecodedFileUseCase.execute(`./public/whatsapp/audio/${audioFile}`);

    return await response.text()
  }
}