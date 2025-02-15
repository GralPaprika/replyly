import {ReadMessageRequestSchema} from "@/lib/whatsapp/models/message/ReadMessageRequestSchema";
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {HttpHeader} from "@/lib/common/models/HttpHeader";
import {ContentType} from "@/lib/common/models/ContentType";

const URL = process.env.WHATSAPP_SERVICE ?? 'http://localhost:3030'
const API_KEY = process.env.WHATSAPP_API_KEY ?? 'error'

export class ReadReceivedMessageUseCase {

  async execute(data: ReadMessageRequestSchema, whatsappId: string): Promise<void> {

    const response = await fetch(
      `${URL}/${whatsappId}/messages/read`,
      {
        method: HttpMethod.POST,
        headers: {
          [HttpHeader.XApiKey]: API_KEY,
          [HttpHeader.ContentType]: ContentType.ApplicationJson,
        },
        body: JSON.stringify(data),
      }
    )

    return await response.json()
  }
}