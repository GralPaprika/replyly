import {NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {WhatsappApiRouteController} from "@/lib/whatsapp/controllers/WhatsappApiRouteController";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";

/**
 * This HTTP Method for endpoint is development only, it will be removed before release.
 */
export async function GET(request: Request, {params}: { params: Promise<{ id: string }> }) {
  return NextResponse.json(
    {message: "received"},
    {status: HttpResponseCode.AlreadyReported},
  )
}

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

  console.log('received', JSON.stringify(webhookSchema, null, 2))

  const {body, init} = await controller.processMessage(whatsappId, webhookSchema.data)

  return NextResponse.json(body, init)
}
