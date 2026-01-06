import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public', 'icons');

    // Check if directory exists
    try {
      await fs.access(iconsDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json({ icons: [] });
    }

    // Read all files in the directory
    const files = await fs.readdir(iconsDir);

    // Filter for image files (png, jpg, jpeg, svg, gif, webp)
    const iconFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext);
    });

    return NextResponse.json({ icons: iconFiles });
  } catch (error) {
    console.error('Error reading icons directory:', error);
    return NextResponse.json({ icons: [], error: 'Failed to read icons' }, { status: 500 });
  }
}
