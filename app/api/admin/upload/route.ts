import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const newFilename = `${uniqueSuffix}-${filename}`;
    
    // Save to public/products
    const path = join(process.cwd(), 'public', 'products', newFilename);
    await writeFile(path, buffer);
    
    const url = `/products/${newFilename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
