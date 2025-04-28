import {NextRequest, NextResponse} from "next/server";
import {PlansController} from "@/lib/plans/controller/PlansController";
import {PlansComposition} from "@/composition/PlansComposition";

const controller = new PlansController(PlansComposition.provideInstance());

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello from plans" });
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();

  const {init, body} = await controller.addPlan(reqBody);

  return NextResponse.json(body, init);
}