import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'work-pulse';

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Missing Cloudinary env variables' },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloud_name: cloudName,
      api_key: apiKey,
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);

    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}