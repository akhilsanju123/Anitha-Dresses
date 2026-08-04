/**
 * Analytics Hooks & Tracking Service Readiness
 * Supports Google Analytics 4, Meta Pixel, and GTM Event Dispatching
 */

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}

export function trackEvent(action: string, category: string, label: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', action, { category, label, value });
  }
}

export function trackAddToCart(productId: string, productName: string, price: number) {
  trackEvent('add_to_cart', 'ecommerce', `${productName} (${productId})`, price);
}

export function trackPurchase(orderId: string, total: number) {
  trackEvent('purchase', 'ecommerce', `Order #${orderId}`, total);
}
