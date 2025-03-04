import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {UserRoles} from "@/lib/common/models/UserRoles";

export class HasUserSecretaryPermissionsUseCase {
  constructor(private readonly composition: WhatsappRepository) {}

  async execute(remoteUserJid: string): Promise<boolean> {
    const user = await this.composition.getUserFromWhatsappJid(remoteUserJid)
    return user ? user.role === UserRoles.Admin : false;
  }
}