export function generateUPIDeepLink(upiId: string, payeeName: string, amount: number, orderId: string): string {
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(`Order ${orderId} Anitha Dresses`);
  return `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;
}
