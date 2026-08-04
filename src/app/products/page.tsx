'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/product/ProductCard';
import { Category, Brand, Product } from '../../types';
import { Search, Filter, Sparkles } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  const subcatParam = searchParams.get('subcategory');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subcatParam || 'All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');

  useEffect(() => {
    async function loadFiltersAndProducts() {
      try {
        setLoading(true);
        const [resProd, resCat, resBrand] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/brands', { cache: 'no-store' }),
        ]);

        const jsonProd = await resProd.json();
        if (jsonProd.success) {
          const list = Array.isArray(jsonProd.data) ? jsonProd.data : (jsonProd.data?.products || []);
          setProducts(list);
        }

        const jsonCat = await resCat.json();
        if (jsonCat.success && Array.isArray(jsonCat.data)) {
          setCategories(jsonCat.data);
        }

        const jsonBrand = await resBrand.json();
        if (jsonBrand.success && Array.isArray(jsonBrand.data)) {
          setBrands(jsonBrand.data);
        }
      } catch (err) {
        console.warn("Error fetching catalog data from API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFiltersAndProducts();
  }, []);

  useEffect(() => {
    if (catParam) setSelectedCategory(catParam);
    if (subcatParam) setSelectedSubcategory(subcatParam);
  }, [catParam, subcatParam]);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedSubcategory !== 'All' && p.subcategory && p.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
    if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as any)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.offerPrice - b.offerPrice;
    if (sortBy === 'price_high') return b.offerPrice - a.offerPrice;
    if (sortBy === 'popular') return b.rating - a.rating;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const selectedCatObj = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ANITHA DRESSES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
            Shop All Products
          </h1>
          <p className="text-xs text-amber-200/80 font-serif">
            Browse complete catalog for Men, Ladies, and Kids fashion.
          </p>
        </div>

        {/* Search & Toolbar */}
        <div className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by dress name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gold-200/50 focus:outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs">
            <span className="text-amber-300 font-bold hidden sm:inline">Products Found: {sortedProducts.length}</span>

            <div className="flex items-center gap-2">
              <span className="text-gold-200 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-maroon-950 border border-amber-500/30 rounded-xl p-2 text-xs text-amber-300 font-bold focus:outline-none"
              >
                <option value="latest">Latest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter */}
          <div className="hidden lg:block space-y-6 bg-maroon-900/60 p-6 rounded-3xl border border-amber-500/30 shadow-luxury h-fit text-xs">
            <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filter Products</span>
            </h3>

            {/* Dynamic Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gold-200">Department:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('All');
                }}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-amber-300 font-bold focus:outline-none"
              >
                <option value="All">All Departments</option>
                {categories.map(c => (
                  <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Subcategory Filter */}
            {selectedCategory !== 'All' && selectedCatObj && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gold-200">Subcategory:</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-amber-300 font-bold focus:outline-none"
                >
                  <option value="All">All Subcategories</option>
                  {(selectedCatObj.subcategories || []).map((sub, sIdx) => (
                    <option key={sIdx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Dynamic Brand Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gold-200">Brand:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-amber-300 font-bold focus:outline-none"
              >
                <option value="All">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-amber-300 text-sm font-serif">Loading live catalog from database...</div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-maroon-900/60 p-12 rounded-3xl border border-amber-500/30 text-center space-y-3">
                <p className="text-base font-bold text-amber-300">No products found matching filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSubcategory('All');
                    setSelectedBrand('All');
                    setSearchQuery('');
                  }}
                  className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-amber-300 font-serif">Loading products...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
