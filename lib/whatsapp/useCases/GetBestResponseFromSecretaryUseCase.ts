import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {HttpMethod} from "@/lib/common/models/HttpMethod";

export class GetBestResponseFromSecretaryUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(remoteUserJid: string): Promise<{message: string, userId: string}> {
    const user = await this.repository.getUserFromWhatsappJid(remoteUserJid)
    const businesses = await this.repository.getLocationsFromUser(user?.id ?? '')

    if (!user) {
      throw new Error('User not found')
    }

    const url = process.env.BOT_SERVICE_URL || '';

    const body = {
      userId: user.id,
      businesses: businesses,
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
