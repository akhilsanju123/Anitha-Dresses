'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/product/ProductCard';
import { Category, Product } from '../../../types';
import Link from 'next/link';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const resCat = await fetch('/api/categories', { cache: 'no-store' });
        const jsonCat = await resCat.json();
        let currentCat: Category | null = null;

        if (jsonCat.success && Array.isArray(jsonCat.data)) {
          const matched = jsonCat.data.find((c: Category) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
          if (matched) currentCat = matched;
        }

        if (!currentCat) {
          currentCat = {
            id: 'cat-default',
            name: slug.toUpperCase(),
            slug: slug,
            image: '',
            description: `Exclusive ${slug} fashion collection at ANITHA DRESSES.`,
            subcategories: [],
            itemCount: 0,
          };
        }

        setCategory(currentCat);

        const resProd = await fetch(`/api/products?category=${encodeURIComponent(currentCat.name)}`, { cache: 'no-store' });
        const jsonProd = await resProd.json();
        if (jsonProd.success) {
          const list = Array.isArray(jsonProd.data) ? jsonProd.data : (jsonProd.data?.products || []);
          setProducts(list.filter((p: Product) => p.category.toLowerCase() === currentCat!.name.toLowerCase()));
        }
      } catch (err) {
        console.warn("Failed fetching category page details", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadData();
  }, [slug]);

  if (!category && !loading) {
    return (
      <div className="py-24 bg-maroon-950 text-gold-100 min-h-screen text-center font-serif text-sm">
        Category not found.
      </div>
    );
  }

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 text-center space-y-2 shadow-luxury">
          <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Department Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif mt-2">{category?.name || slug.toUpperCase()}</h1>
          <p className="text-xs text-amber-200/70 max-w-xl mx-auto pt-2">{category?.description}</p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="py-16 text-center text-amber-300 font-serif text-sm">Loading category catalog...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm text-amber-300">No products found in this category.</p>
            <Link href="/products" className="inline-block text-xs font-bold text-amber-400 underline">
              Browse All Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
