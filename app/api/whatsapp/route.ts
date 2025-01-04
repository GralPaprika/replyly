import {NextResponse} from "next/server";

export async function POST(request: Request) {
  // Request body to cast it as needed to process the messages. This is because the Whapi service sends the messages and
  // status updates in a specific format for each case.
  const data: any = await request.json()

  console.log(JSON.stringify(data, null, 2))

  return NextResponse.json({"message": "received"}, {status: 200})
}