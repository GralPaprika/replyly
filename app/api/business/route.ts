import {NextResponse} from "next/server";
import {BusinessSchema} from "@/lib/business/models/BusinessSchema";
import {BusinessApiRouteController} from "@/lib/business/controllers/BusinessApiRouteController";
import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";

export async function POST(request: Request) {
  const data: BusinessSchema = await request.json()

  const controller = new BusinessApiRouteController(BusinessRouteComposition.provideInstance())

  const businessId = await controller.createBusiness(data)

  return NextResponse.json({businessId}, {status: 200})
}