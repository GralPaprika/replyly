import {NextResponse} from "next/server";
import {AuthController} from "@/lib/auth/AuthController";
import {AuthComposition} from "@/composition/AuthComposition";

export async function POST(request: Request) {
  const controller = new AuthController(AuthComposition.provideInstance())

  const result = await controller.signUp(await request.json())

  return NextResponse.json(result, {status: 200})
}