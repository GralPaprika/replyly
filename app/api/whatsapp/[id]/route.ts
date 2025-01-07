import {NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {WhatsappApiRouteController} from "@/lib/whatsapp/controllers/WhatsappApiRouteController";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";

/**
 * This HTTP Method for endpoint is development only, it will be removed before release.
 */
export async function GET(request: Request, {params}: { params: Promise<{ id: string }> }) {
  const whatsappId = (await params).id

  // await controller.saveResponses(whatsappId, [
  //   "Dirección: 789 Lexington Avenue, New York, NY 10065",
  //   "Horario: 8:00 AM - 8:00 PM",
  //   "Teléfono: 1234567890",
  //   "Correo: info@oscorpindustries.com",
  // ])

  const controller = new WhatsappApiRouteController(WhatsappRouteComposition.provideInstance())

  return NextResponse.json(
    {message: "received"},
    {status: HttpResponseCode.AlreadyReported},
  )
}

/**
 * This method captures messages received and sent from a whatsapp number through the Whapi service.
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
