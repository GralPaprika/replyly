
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import Path from "path";

const publicFolder = Path.resolve(__dirname, '..', '..', '..', '..', 'public')

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const slug = params.slug || []  // ["images", "avatar", "1234567.jpg"]
    const filePath = slug ? Path.join(publicFolder, ...slug) : null

    if (!filePath) return new NextResponse('Not Found', { status: 404 })

    const fileContent = await fs.readFile(filePath)

    if (!fileContent) return new NextResponse('Not Found', { status: 404 })

    return new NextResponse(fileContent)

  } catch (err) {
    console.error(' GET Avatar | err: ', err)
    return new NextResponse('Not Found', { status: 404 })
  }
}