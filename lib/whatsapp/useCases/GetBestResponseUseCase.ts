import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {BotWebhookResponse} from "@/lib/whatsapp/models/botservice/BotWebhookResponse";
import {BotWebhookRequest} from "@/lib/whatsapp/models/botservice/BotWebhookRequest";

export class GetBestResponseUseCase {
  async execute(requestData: BotWebhookRequest) {
    const response = await fetch(process.env.BOT_SERVICE_URL || '', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const data: BotWebhookResponse = await response.json()

    return data.message
  }
}