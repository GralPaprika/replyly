import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {User} from "@/lib/whatsapp/models/User";
import {Exception} from "@/lib/common/models/Exception";

export class GetUserIdException implements Exception {
  constructor(readonly message: string) {}
}

export class GetUserIdUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(remoteUserJid: string): Promise<User> {
    const user = await this.repository.getUserFromWhatsappJid(remoteUserJid)

    if (!user) {
      throw new GetUserIdException('User not found')
    }

    return user
  }
}