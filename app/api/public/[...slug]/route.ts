
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import Path from "path";

const publicFolder = Path.resolve(__dirname, '..', '..', '..', '..', 'public')

enum ContentType {
  Oga = 'audio/ogg',
  All = '*/*',
}

export async function GET(req: Request, props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  try {
    const slug = params.slug || []  // ["images", "avatar", "1234567.jpg"]
    const filePath = slug ? Path.join(publicFolder, ...slug) : null

    if (!filePath) return new NextResponse('Not Found', { status: 404 })

    const fileContent = await fs.readFile(filePath)

    if (!fileContent) return new NextResponse('Not Found', { status: 404 })

    const contentType = getContentTypes(getFileExtension(slug[slug.length - 1]))
    return new NextResponse(fileContent, {
      headers: {
        'Accept': contentType,
        'Content-Type': contentType,
      },
    })

  } catch (err) {
    console.error(' GET Avatar | err: ', err)
    return new NextResponse('Not Found', { status: 404 })
  }
}

function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

function getContentTypes(type: string): string {
  switch (type) {
    case 'oga':
      return ContentType.Oga
    default:
      return ContentType.All
  }
}