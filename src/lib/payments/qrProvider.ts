export function validateQRScreenshot(file: File | string): boolean {
  if (typeof file === 'string') return file.startsWith('http') || file.startsWith('data:image/');
  return file.size <= 10 * 1024 * 1024; // 10MB limit
}
