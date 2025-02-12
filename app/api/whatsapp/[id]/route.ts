import {NextResponse} from "next/server";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {WhatsappApiRouteController} from "@/lib/whatsapp/controllers/WhatsappApiRouteController";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";

/**
 * This method captures messages received and sent from a whatsapp number.
 *
 * It is required to be HTTP POST method.
 *
 * The route parameter is the whatsapp id and is used to identify a specific conversation.
 */
export async function POST(request: Request, {params}: { params: { id: string } }) {
  // Route parameter
  const whatsappId = params.id

  const webhookSchema: MessageWebhookSchema = await request.json()

  const controller = new WhatsappApiRouteController(WhatsappRouteComposition.provideInstance())

  const {body, init} = await controller.processMessage(whatsappId, webhookSchema.data)

  return NextResponse.json(body, init)
}
