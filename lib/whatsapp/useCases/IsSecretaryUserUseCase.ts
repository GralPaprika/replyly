import { WhatsappRepository } from "../models/WhatsappRepository";

export class IsSecretaryUserUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  async execute(sessionId: string): Promise<boolean> {
    return this.whatsappRepository.isSecretaryUser(sessionId);
  }
}