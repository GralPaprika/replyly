import { NextResponse } from "next/server";

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const planId = params.id;

  const body = await request.json();

  return NextResponse.json({ planId, body });
}