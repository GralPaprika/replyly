import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {AudioMessage} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";

export class GetBestResponseForAudioUseCase {
  async execute(audioData: AudioMessage) {
    const response = await fetch(process.env.BOT_SERVICE_URL || '', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(audioData)
    });

    // TODO: Format json response
    return await response.text()
  }
}