import { WhatsappRepository } from "../models/WhatsappRepository";

export class IsSecretaryUserUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  async execute(remoteUserId: string): Promise<boolean> {
    return this.whatsappRepository.isSecretaryUser(remoteUserId);
  }
}