import {NextRequest, NextResponse} from "next/server";
import {UserRouteController} from "@/lib/users/UserRouteController";
import {UserRouteComposition} from "@/composition/UserRouteComposition";
import {UpdateUserBusinessDto} from "@/lib/users/models/UpdateUserBusinessDto";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";

const controller = new UserRouteController(UserRouteComposition.provideInstance());

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const phone = searchParams.get('phone')

  if (!phone)
    return NextResponse.json(null)

  return NextResponse.json(await controller.findUser(phone))
}

export async function POST(req: NextRequest) {
  try {
    const userData: UpdateUserBusinessDto = await req.json()

    if (!controller.isValidUpdateUserBusinessDto(userData)) {
      return NextResponse.json({error: 'Invalid request data'}, {status: HttpResponseCode.BadRequest})
    }

    const result = await controller.updateOrCreateUser(userData)

    return NextResponse.json({userId: result})
  } catch (exception) {
    // @ts-ignore
    return NextResponse.json({error: exception.message}, {status: HttpResponseCode.ServerError})
  }
}