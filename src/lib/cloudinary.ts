/**
 * Cloudinary File Storage Helper
 * Provides image URL optimization, WebP conversion, and base64 upload fallback for local execution.
 */

export function getOptimizedImageUrl(url: string, width = 800, quality = 'auto'): string {
  if (!url) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80';
  
  if (url.includes('cloudinary.com')) {
    // Inject dynamic transformation parameters into Cloudinary URLs
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_${quality}/`);
  }
  
  if (url.includes('unsplash.com')) {
    return url.replace(/w=\d+/, `w=${width}`);
  }

  return url;
}

export async function uploadToCloudinary(fileBase64OrUrl: string, folder = 'anitha_dresses'): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (cloudName && apiKey) {
    try {
      // Production Cloudinary REST API upload call
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: fileBase64OrUrl,
          upload_preset: 'ml_default',
          folder,
        }),
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
    } catch (error) {
      console.warn("Cloudinary upload failed, using direct payload fallback:", error);
    }
  }

  // Fallback return for test/dev mode
  return fileBase64OrUrl;
}
