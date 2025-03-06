import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {BotSecretaryResponse} from "@/lib/whatsapp/models/botsecretary/BotSecretaryResponse";

export class GetBestResponseFromSecretaryUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(remoteUserJid: string, message: string): Promise<BotSecretaryResponse> {
    const user = await this.repository.getUserFromWhatsappJid(remoteUserJid)

    if (!user) {
      throw new Error('User not found')
    }

    const business = await this.repository.getBusinessWithWhatsappsFromUser(user?.id ?? '')

    const url = process.env.BOT_SERVICE_URL || '';

    const body = {
      userId: user.id,
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
      userId: user.id,
      message: await response.text(),
    }
  }
}
