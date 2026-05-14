// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique file name
    const filename = file.name.replace(/\s/g, '_');
    
    // Set upload directory (make sure this folder exists in your /public directory!)
    // For production, you should upload this buffer to S3, Cloudinary, or Vercel Blob instead!
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filepath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return the URL that will be placed into the Email Signature
    // E.g., https://yourdomain.com/uploads/profile-123456789.png
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}