import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.content) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public/testTiptap.json');
        fs.writeFileSync(filePath, JSON.stringify(body.content, null, 2), 'utf-8');

        return NextResponse.json({ success: true, message: 'File updated successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json(
            { error: 'Failed to write file', details: (error as Error).message },
            { status: 500 }
        );
    }
}