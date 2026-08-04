import { Metadata } from 'next';
import { Product } from '../types';

export const DEFAULT_SITE_METADATA = {
  title: 'ANITHA DRESSES - Family Fashion Shopping Mall, Ongole',
  description: 'ANITHA DRESSES (Ongole): Premier family fashion shopping destination for Men, Ladies, and Kids apparel.',
  keywords: 'ANITHA DRESSES, Anitha Dresses Ongole, Family Shopping Mall Ongole, Mens Wear, Ladies Wear, Kids Wear, Readymade Dresses, Kurta Sets',
  url: 'https://anithadresses.com',
};

export function constructMetadata({
  title = DEFAULT_SITE_METADATA.title,
  description = DEFAULT_SITE_METADATA.description,
  image = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop&q=85',
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: DEFAULT_SITE_METADATA.keywords,
    openGraph: {
      title,
      description,
      url: canonical || DEFAULT_SITE_METADATA.url,
      siteName: 'ANITHA DRESSES',
      images: [{ url: image }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonical || DEFAULT_SITE_METADATA.url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    mpn: product.barcode || product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'ANITHA DRESSES',
    },
    offers: {
      '@type': 'Offer',
      url: `${DEFAULT_SITE_METADATA.url}/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.offerPrice || product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewsCount || 10,
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'ANITHA DRESSES (Family Shopping Mall)',
    alternateName: 'ANITHA DRESSES',
    url: DEFAULT_SITE_METADATA.url,
    logo: `${DEFAULT_SITE_METADATA.url}/favicon.svg`,
    telephone: '+918977969989',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 62 & 77, Sri Balaji Market Road',
      addressLocality: 'Ongole',
      addressRegion: 'Andhra Pradesh',
      postalCode: '523001',
      addressCountry: 'IN',
    },
    priceRange: '₹₹',
  };
}
