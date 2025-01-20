import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const data: any = await request.json()

  console.log(JSON.stringify(data, null, 2))

  return NextResponse.json({"message": "received"}, {status: 200})
}