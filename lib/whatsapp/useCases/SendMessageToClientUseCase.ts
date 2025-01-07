import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {ContentType} from "@/lib/common/models/ContentType";
import {HttpHeader} from "@/lib/common/models/HttpHeader";
import {SendMessageRequestSchema} from "@/lib/whatsapp/models/message/SendMessageRequestSchema";
import {SendMessageResponseSchema} from "@/lib/whatsapp/models/message/SendMessageResponseSchema";
import {Exception} from "@/lib/common/models/Exception";

export class SendMessageToClientException implements Exception {
  constructor(readonly message: string) {}
}

const URL = process.env.WHATSAPP_SERVICE ?? 'localhost:3030'

export class SendMessageToClientUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Send a message to a specific recipient using whatsapp channel.
   * @param senderID The ID of the sender (a replyly user).
   * @param recipientId The ID of the recipient (WhatsApp format: 0001112222@x.yyy.zzz).
   * @param message The message to be sent.
   * @returns {Promise<SendMessageResponseSchema>}
   * @throws {SendMessageToClientException}
   */
  async execute(senderID: string, recipientId: string, message: string): Promise<SendMessageResponseSchema> {
    try {
      const body: SendMessageRequestSchema = {
        jid: recipientId,
        type: 'number',
        message: {
          text: message,
        }
      }

      const response = await fetch(
        `${URL}/${senderID}/messages/send`,
        {
          method: HttpMethod.POST,
          headers: {
            [HttpHeader.ContentType]: ContentType.ApplicationJson,
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