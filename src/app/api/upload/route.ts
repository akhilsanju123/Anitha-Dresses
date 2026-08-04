import { NextRequest } from 'next/server';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { uploadToCloudinary } from '../../../lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const body = await req.json();
    const { image, folder = 'anitha_dresses' } = body;

    if (!image) {
      return apiResponse(false, null, 'Image payload missing', 400);
    }

    // Upload to Cloudinary REST endpoint or fallback
    const secureUrl = await uploadToCloudinary(image, folder);
    return apiResponse(true, { url: secureUrl }, 'Image uploaded successfully', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Image upload failed', 500);
  }
}
