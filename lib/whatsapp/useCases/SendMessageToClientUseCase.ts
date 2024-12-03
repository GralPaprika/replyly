import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {ContentType} from "@/lib/common/models/ContentType";
import {HttpHeader} from "@/lib/common/models/HttpHeader";
import {SendMessageRequestSchema} from "@/lib/whatsapp/models/message/SendMessageRequestSchema";
import {SentMessageResponseSchema} from "@/lib/whatsapp/models/message/SentMessageResponseSchema";
import {Exception} from "@/lib/common/models/Exception";

const URL = 'https://gate.whapi.cloud/messages/text'

export class SendMessageToClientException implements Exception {
  constructor(readonly message: string) {}
}

export class SendMessageToClientUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Send a message to a specific recipient using whatsapp channel.
   * @param whatsappId The ID of the whatsapp channel.
   * @param recipientId The ID of the recipient (format provided by Whapi).
   * @param message The message to be sent.
   * @returns {Promise<SentMessageResponseSchema>}
   * @throws {SendMessageToClientException}
   */
  async execute(whatsappId: string, recipientId: string, message: string): Promise<SentMessageResponseSchema> {
    try {
      const token = await this.whatsappRepository.getWhatsappTokenByWhatsappId(whatsappId)
      const body: SendMessageRequestSchema = { to: recipientId, body: message }

      const response = await fetch(
        URL,
        {
          method: HttpMethod.POST,
          headers: {
            [HttpHeader.ContentType]: ContentType.ApplicationJson,
            [HttpHeader.Authorization]: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      )

      return await response.json()
    } catch (exception) {
      // @ts-ignore
      throw new SendMessageToClientException(exception.message)
    }
  }
}