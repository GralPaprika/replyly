import {NextRequest, NextResponse} from "next/server";
import {BusinessData} from "@/lib/business/models/BusinessData";
import {BusinessApiRouteController} from "@/lib/business/controllers/BusinessApiRouteController";
import {BusinessRouteComposition} from "@/composition/BusinessRouteComposition";

const controller = new BusinessApiRouteController(BusinessRouteComposition.provideInstance())

export async function GET(request: NextRequest) {

  const businesses = await controller.getAllBusinesses()

  return NextResponse.json(businesses, {status: 200})
}

export async function POST(request: Request) {
  const data: BusinessData = await request.json()

  const business = await controller.createBusiness(data)

  return NextResponse.json(business, {status: 200})
}