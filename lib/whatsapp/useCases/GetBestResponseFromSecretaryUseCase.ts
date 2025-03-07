import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {BotSecretaryResponse} from "@/lib/whatsapp/models/botsecretary/BotSecretaryResponse";
import {BotSecretaryTextRequest} from "@/lib/whatsapp/models/botsecretary/BotSecretaryTextRequest";

export class GetBestResponseFromSecretaryUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(userId: string, secretaryId: string, message: string): Promise<BotSecretaryResponse> {
    const business = await this.repository.getBusinessWithWhatsappsFromUser(userId)

    const url = process.env.BOT_SERVICE_URL || '';

    const body: BotSecretaryTextRequest = {
      userId,
      secretaryId,
      businessId: business.id,
      whatsappIds: business.whatsapps,
      message,
    }

    const response = await fetch(`${url}/secretary`, {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    return {
      userId,
      message: await response.text(),
    }
  }
}
