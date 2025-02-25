import {NextResponse} from "next/server";
import {BusinessData} from "@/lib/business/models/BusinessData";
import {BusinessApiRouteController} from "@/lib/business/controllers/BusinessApiRouteController";
import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";

export async function POST(request: Request) {
  const data: BusinessData = await request.json()

  const controller = new BusinessApiRouteController(BusinessRouteComposition.provideInstance())

  const business = await controller.createBusiness(data)

  return NextResponse.json(business, {status: 200})
}