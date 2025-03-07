import {NotificationController} from "@/lib/notifications/controller/NotificationController";
import {NotificationComposition} from "@/composition/NotificationComposition";
import {NextResponse} from "next/server";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";

const InvalidRequestData = "Invalid request data";

const controller = new NotificationController(NotificationComposition.provideInstance())

export async function POST(request: Request) {

  const data = await request.json();

  if (!controller.isValidSecretaryNotificationData(data)) {
    return NextResponse.json({error: InvalidRequestData}, {status: HttpResponseCode.BadRequest});
  }

  const {init, body} = await controller.sendSecretaryNotification(data)

  return NextResponse.json(body, init)
}